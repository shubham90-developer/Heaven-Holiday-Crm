import fs from "fs/promises";
import path from "path";
import { ProposalImageModel } from "../settings/proposal-images/proposalImage.model";
import { IProposalImageFile } from "../settings/proposal-images/proposalImage.interface";

const SEARCH_ALIASES: Record<string, string> = {
    thiland: "Thailand",
    bangkokk: "Bangkok",
    pataia: "Pattaya",
    phuket: "Phuket",
};

const MIME_BY_EXT: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
};

export const normalizeSearchTerm = (value?: string) => {
    let text = (value || "")
        .replace(/\([^)]*\)/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    if (!text || /^na$/i.test(text)) return "";
    text = text.replace(/thiland/gi, "Thailand");
    const alias = SEARCH_ALIASES[text.toLowerCase()];
    return alias || text;
};

const keyOf = (value?: string) => normalizeSearchTerm(value).toLowerCase();

const STOP_WORDS = new Set([
    "the",
    "and",
    "tour",
    "show",
    "visit",
    "trip",
    "day",
    "from",
    "with",
    "for",
    "of",
    "city",
]);

const splitSearchTerms = (values: Array<string | undefined>) =>
    Array.from(
        new Set(
            values
                .flatMap((value) => (value || "").split(/[,;/|]+/))
                .map((value) => normalizeSearchTerm(value))
                .filter(Boolean)
        )
    );

const matchScore = (libraryName: string, searchTerm: string) => {
    const a = keyOf(libraryName);
    const b = keyOf(searchTerm);
    if (!a || !b) return 0;
    if (a === b) return 4;
    if (a.includes(b) || b.includes(a)) return 3;
    const aParts = a.split(/[\s,/|-]+/).filter((part) => part.length > 4 && !STOP_WORDS.has(part));
    const bParts = b.split(/[\s,/|-]+/).filter((part) => part.length > 4 && !STOP_WORDS.has(part));
    if (aParts.some((part) => bParts.includes(part))) return 2;
    return 0;
};

const fileToDataUri = async (image: IProposalImageFile): Promise<string | null> => {
    try {
        const absolute = path.join(process.cwd(), image.url.replace(/^\/+/, ""));
        const buffer = await fs.readFile(absolute);
        if (!buffer.length) return null;
        const ext = path.extname(image.fileName).toLowerCase();
        const mime = image.mimeType || MIME_BY_EXT[ext] || "image/jpeg";
        return `data:${mime};base64,${buffer.toString("base64")}`;
    } catch (error) {
        console.error("Proposal library image missing", image.url, error);
        return null;
    }
};

const filesToDataUris = async (files: IProposalImageFile[], count: number) => {
    const uris: string[] = [];
    for (const file of files) {
        if (uris.length >= count) break;
        const uri = await fileToDataUri(file);
        if (uri) uris.push(uri);
    }
    return uris;
};

const fillCount = (images: string[], count: number) => {
    if (!images.length) return [];
    if (images.length >= count) return images.slice(0, count);
    const filled = [...images];
    while (filled.length < count) {
        filled.push(images[filled.length % images.length]);
    }
    return filled;
};

type LibraryEntry = {
    category: "destination" | "sightseeing";
    name: string;
    city?: string;
    images: IProposalImageFile[];
};

const pickEntries = (
    library: LibraryEntry[],
    category: "destination" | "sightseeing",
    terms: string[]
) => {
    const ranked = library
        .filter((item) => item.category === category)
        .map((item) => ({
            item,
            score: Math.max(
                0,
                ...terms.map((term) =>
                    Math.max(
                        matchScore(item.name, term),
                        category === "destination" ? matchScore(item.city || "", term) : 0
                    )
                )
            ),
        }))
        .filter((row) => row.score > 0)
        .sort((left, right) => right.score - left.score);

    return ranked.map((row) => row.item);
};

export const attachDestinationImages = async <
    T extends {
        coverImageUrl: string;
        days: Array<{
            dayNumber: number;
            title: string;
            sightseeing: string;
            activityTitle: string;
            imageUrls: string[];
            imagePrompts?: string[];
        }>;
        activities: Array<{
            dayNumber: number;
            name: string;
            city: string;
            imageUrl: string;
            imagePrompt?: string;
        }>;
    },
>(
    content: T,
    payload: {
        destinations?: string[];
        hotels?: Array<{ city?: string; hotelName?: string }>;
        sightseeing?: string[];
        dayTitles?: Array<{ dayNumber: number; title?: string; city?: string }>;
    }
): Promise<T> => {
    const dests = splitSearchTerms(payload.destinations || []);
    const mainDest = dests[0] || "";
    const records = await ProposalImageModel.find({
        isDeleted: false,
        enabled: true,
        status: "Active",
    }).lean();

    const library: LibraryEntry[] = records.map((item) => ({
        category: item.category,
        name: item.name,
        city: item.city,
        images: item.images || [],
    }));

    const destinationTerms = splitSearchTerms([
        ...dests,
        ...(payload.dayTitles || []).map((day) => day.city),
        ...(payload.hotels || []).map((hotel) => hotel.city),
    ]);

    const coverFiles = pickEntries(
        library,
        "destination",
        destinationTerms.length ? destinationTerms : [mainDest]
    ).flatMap((item) => item.images);
    const coverImages = await filesToDataUris(coverFiles, 1);

    const cityPools: Record<string, string[]> = {};
    for (const city of destinationTerms) {
        const files = pickEntries(library, "destination", [city, mainDest]).flatMap(
            (item) => item.images
        );
        cityPools[city] = await filesToDataUris(files, 8);
    }

    const days = await Promise.all(
        (content.days || []).map(async (day, index) => {
            const city =
                normalizeSearchTerm(payload.dayTitles?.[index]?.city) ||
                dests[Math.min(index, dests.length - 1)] ||
                mainDest;
            const activityTerms = splitSearchTerms([
                day.activityTitle,
                day.sightseeing,
                payload.sightseeing?.[index],
            ]);
            const pool = cityPools[city] || cityPools[mainDest] || [];
            const files = pickEntries(library, "sightseeing", activityTerms).flatMap(
                (item) => item.images
            );
            const activityImages = await filesToDataUris(files, 2);
            const combined = [...activityImages, ...pool, ...coverImages].filter(Boolean);
            return {
                ...day,
                imageUrls: fillCount(combined, 5),
            };
        })
    );

    const activities = await Promise.all(
        (content.activities || []).map(async (item, index) => {
            const city = normalizeSearchTerm(item.city) || mainDest;
            const nameTerms = splitSearchTerms([
                item.name,
                payload.sightseeing?.[index],
                content.days?.[index]?.activityTitle,
                content.days?.[index]?.sightseeing,
            ]);
            const files = pickEntries(library, "sightseeing", nameTerms).flatMap(
                (row) => row.images
            );
            const images = await filesToDataUris(files, 1);
            const fallback = cityPools[city]?.[0] || coverImages[0] || "";
            return {
                ...item,
                imageUrl: images[0] || fallback,
            };
        })
    );

    return {
        ...content,
        coverImageUrl: coverImages[0] || Object.values(cityPools)[0]?.[0] || "",
        days,
        activities,
    };
};
