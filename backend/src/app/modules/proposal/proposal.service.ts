import { attachDestinationImages } from "./proposal.images";

export type ProposalGeneratePayload = {
    customerName?: string;
    goingFrom?: string;
    destinations?: string[];
    nights?: number;
    days?: number;
    adults?: number;
    travelDate?: string;
    overview?: string;
    hotels?: Array<{ city?: string; hotelName?: string; nights?: number }>;
    sightseeing?: string[];
    dayTitles?: Array<{ dayNumber: number; title?: string; city?: string; date?: string }>;
};

export type ProposalAiDay = {
    dayNumber: number;
    title: string;
    description: string;
    meals: string;
    sightseeing: string;
    activityTitle: string;
    activityDescription: string;
    imagePrompts: string[];
    imageUrls: string[];
};

export type ProposalAiActivity = {
    dayNumber: number;
    name: string;
    city: string;
    description: string;
    imagePrompt: string;
    imageUrl: string;
};

export type ProposalAiContent = {
    aiEnabled: boolean;
    coverImagePrompt: string;
    coverImageUrl: string;
    days: ProposalAiDay[];
    activities: ProposalAiActivity[];
};

const MODEL = () => process.env.OPENROUTER_MODEL || "qwen/qwen3.8-flash";

const parseJson = (text: string) => {
    const trimmed = (text || "").trim();
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const raw = fenced ? fenced[1] : trimmed;
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in AI response");
    return JSON.parse(raw.slice(start, end + 1));
};

const fallbackContent = (payload: ProposalGeneratePayload): ProposalAiContent => {
    const dests = payload.destinations?.filter(Boolean) || ["Destination"];
    const dayCount = Number(payload.days) || payload.dayTitles?.length || 2;
    const from = (payload.goingFrom || "").replace(/^NA$/i, "").trim() || dests[0];

    const days: ProposalAiDay[] = Array.from({ length: dayCount }, (_, index) => {
        const meta = payload.dayTitles?.[index];
        const city = meta?.city || dests[Math.min(index, dests.length - 1)];
        const dayNumber = meta?.dayNumber || index + 1;
        const title =
            meta?.title ||
            (index === 0
                ? `${from} TO ${city}`.toUpperCase()
                : index === dayCount - 1
                    ? `${city} TO ${from}`.toUpperCase()
                    : `${city} SIGHTSEEING`.toUpperCase());
        const sightseeing =
            payload.sightseeing?.[index] ||
            payload.sightseeing?.join(", ") ||
            `${city} highlights`;
        return {
            dayNumber,
            title,
            description: `After breakfast, enjoy a well-paced day in ${city}. Transfers and sightseeing are arranged as per the itinerary, with time to relax at the hotel. Overnight stay in ${city}.`,
            meals: index === 0 ? "Lunch, Dinner" : index === dayCount - 1 ? "Breakfast" : "Breakfast, Lunch, Dinner",
            sightseeing,
            activityTitle: sightseeing.split(",")[0]?.trim() || `${city} Tour`,
            activityDescription: `Experience the best of ${city} with guided sightseeing and leisure time as per the day's program.`,
            imagePrompts: [],
            imageUrls: [],
        };
    });

    return {
        aiEnabled: false,
        coverImagePrompt: "",
        coverImageUrl: "",
        days,
        activities: days.map((day) => ({
            dayNumber: day.dayNumber,
            name: day.activityTitle,
            city: payload.dayTitles?.[day.dayNumber - 1]?.city || dests[0],
            description: day.activityDescription,
            imagePrompt: "",
            imageUrl: "",
        })),
    };
};

export const generateProposalAiContent = async (
    payload: ProposalGeneratePayload
): Promise<ProposalAiContent> => {
    const fallback = fallbackContent(payload);
    const apiKey = process.env.OPENROUTER_API_KEY;
    let content = fallback;

    const system = `You are a luxury travel proposal writer for A Heaven Hospitality.
Return ONLY valid JSON with this shape:
{
  "days": [{
    "dayNumber": 1,
    "title": "UPPERCASE DAY TITLE",
    "description": "2-4 sentences of itinerary narrative",
    "meals": "Breakfast, Lunch, Dinner",
    "sightseeing": "comma separated attraction names",
    "activityTitle": "short activity name",
    "activityDescription": "2-3 sentences about the activity"
  }],
  "activities": [{
    "dayNumber": 1,
    "name": "Activity name",
    "city": "City",
    "description": "2-3 sentences"
  }]
}
Do not generate or describe AI images. Use real place and attraction names only.`;

    if (apiKey) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 45000);
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://heavenholiday.in",
                        "X-Title": "Heaven Holiday CRM Proposal",
                    },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: MODEL(),
                        temperature: 0.6,
                        messages: [
                            { role: "system", content: system },
                            { role: "user", content: JSON.stringify({
                                customerName: payload.customerName,
                                goingFrom: payload.goingFrom,
                                destinations: payload.destinations,
                                nights: payload.nights,
                                days: payload.days,
                                adults: payload.adults,
                                travelDate: payload.travelDate,
                                overview: payload.overview,
                                hotels: payload.hotels,
                                sightseeing: payload.sightseeing,
                                dayTitles: payload.dayTitles,
                            }) },
                        ],
                    }),
                });

                if (response.ok) {
                    const json = (await response.json()) as {
                        choices?: Array<{ message?: { content?: string } }>;
                    };
                    const text = json?.choices?.[0]?.message?.content || "";
                    const parsed = parseJson(text);
                    content = {
                        aiEnabled: true,
                        coverImagePrompt: "",
                        coverImageUrl: "",
                        days: Array.isArray(parsed.days) && parsed.days.length
                            ? parsed.days.map((day: ProposalAiDay, index: number) => ({
                                ...fallback.days[index],
                                ...day,
                                imagePrompts: [],
                                imageUrls: [],
                            }))
                            : fallback.days,
                        activities: Array.isArray(parsed.activities) && parsed.activities.length
                            ? parsed.activities.map((item: ProposalAiActivity) => ({
                                ...item,
                                imagePrompt: "",
                                imageUrl: "",
                            }))
                            : fallback.activities,
                    };
                } else {
                    console.error("OpenRouter error", response.status, await response.text());
                }
            } finally {
                clearTimeout(timeout);
            }
        } catch (error) {
            console.error("Proposal AI generation failed", error);
            content = fallback;
        }
    }

    return attachDestinationImages(content, payload);
};
