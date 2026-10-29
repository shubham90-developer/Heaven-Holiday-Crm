"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetHotelsQuery } from "@/store/services/inventory/hotel/hotelApi";
import { useGetAreasQuery } from "@/store/services/inventory/area-master/areaMasterApi";
import { useGetSuppliersQuery } from "@/store/services/supplierApi";
import CollapsibleSection from "./CollapsibleSection";
import { showsHotelCostingFields } from "../supplierTypes";

type HotelRecord = {
  _id: string;
  hotelName: string;
  cityName: string;
  roomType?: string;
};

type SupplierRecord = {
  _id: string;
  companyName?: string;
  currencyType?: string;
};

type AreaRecord = {
  _id: string;
  city: string;
};

export type HotelRoom = {
  id: string;
  sharing: string;
  roomType: string;
  mealPlan: string;
  adults: number;
  costPerRoomNight: number;
  roomCostNight: number;
};

export type HotelCity = {
  id: string;
  selfBooked: boolean;
  roomWiseCosting: boolean;
  hotelCity: string;
  checkIn: string;
  nights: number;
  hotelName: string;
  hotelId: string;
  similarHotel: boolean;
  hotelSource: "inventory" | "manual";
  supplierId: string;
  supplierName: string;
  currency: string;
  hotelTaxPercent: string;
  taxAmount: number;
  totalCost: number;
  totalMarkup: string;
  markupEnabled: boolean;
  finalCost: number;
  rooms: HotelRoom[];
};

export type HotelOption = {
  id: string;
  title: string;
  expanded: boolean;
  cities: HotelCity[];
};

type HotelOptionSectionProps = {
  supplierType: string;
  destinationsCovered: string;
  checkInRaw?: string;
  checkIn: string;
  adults: number;
  noOfNights: number;
  currency: string;
  onHotelsChange?: (options: HotelOption[]) => void;
};

const ROOM_SHARING = ["Twin Sharing", "Single", "Double", "Triple", "Quad"];
const MEAL_PLANS = ["Breakfast (CP/BB)", "MAP", "AP", "EP", "AI"];
const ROOM_TYPES = ["Standard", "Deluxe", "Superior", "Suite", "Family"];
const CURRENCIES = ["INR", "USD", "EUR", "AED", "GBP", "THB"];
const SIMILAR_SUFFIX = " | As Similar";

const parseDestinations = (value: string) =>
  value
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const toDateInputValue = (value: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDaysIso = (iso: string, days: number) => {
  const base = toDateInputValue(iso);
  if (!base) return "";
  const date = new Date(`${base}T00:00:00`);
  if (Number.isNaN(date.getTime())) return base;
  date.setDate(date.getDate() + days);
  return toDateInputValue(date.toISOString());
};

const cityKey = (value: string) =>
  value.split("(")[0].trim().toLowerCase();

const cityMatches = (left: string, right: string) => {
  if (!left || !right) return false;
  const a = cityKey(left);
  const b = cityKey(right);
  return a === b || a.includes(b) || b.includes(a);
};

const withSimilarName = (name: string, similar: boolean) => {
  const clean = name.replace(/\s*[/|]\s*As Similar$/i, "").trim();
  if (!clean) return "";
  return similar ? `${clean}${SIMILAR_SUFFIX}` : clean;
};

const formatMoney = (value: number) =>
  Number.isFinite(value) ? value.toFixed(2) : "0.00";

const computeCityTotals = (city: HotelCity): HotelCity => {
  const nights = Number(city.nights) || 0;
  const totalCost = city.rooms.reduce((sum, room) => {
    const rate = Number(room.roomCostNight || room.costPerRoomNight) || 0;
    return sum + rate * Math.max(nights, 1);
  }, 0);
  const taxPercent = Number(city.hotelTaxPercent) || 0;
  const taxAmount = (totalCost * taxPercent) / 100;
  const markup = city.markupEnabled ? Number(city.totalMarkup) || 0 : 0;
  return {
    ...city,
    taxAmount,
    totalCost,
    finalCost: totalCost + taxAmount + markup,
  };
};

const HotelOptionSection = ({
  supplierType,
  destinationsCovered,
  checkInRaw,
  checkIn,
  adults,
  noOfNights,
  currency,
  onHotelsChange,
}: HotelOptionSectionProps) => {
  const idRef = useRef(0);
  const nextId = (prefix: string) => {
    idRef.current += 1;
    return `${prefix}-${idRef.current}`;
  };

  const createRoom = (): HotelRoom => ({
    id: nextId("room"),
    sharing: "Twin Sharing",
    roomType: "Standard",
    mealPlan: "Breakfast (CP/BB)",
    adults: Math.max(1, adults || 1),
    costPerRoomNight: 0,
    roomCostNight: 0,
  });

  const createCity = (index: number, previous?: HotelCity): HotelCity => {
    const destinations = parseDestinations(destinationsCovered);
    const checkInValue = previous
      ? addDaysIso(previous.checkIn, Number(previous.nights) || 0)
      : toDateInputValue(checkInRaw || checkIn);
    return computeCityTotals({
      id: nextId("city"),
      selfBooked: false,
      roomWiseCosting: true,
      hotelCity: destinations[index] || destinations[0] || "",
      checkIn: checkInValue,
      nights: noOfNights || 1,
      hotelName: "",
      hotelId: "",
      similarHotel: false,
      hotelSource: "inventory",
      supplierId: "",
      supplierName: "",
      currency: currency || "INR",
      hotelTaxPercent: "",
      taxAmount: 0,
      totalCost: 0,
      totalMarkup: "",
      markupEnabled: true,
      finalCost: 0,
      rooms: [createRoom()],
    });
  };

  const createOption = (number: number): HotelOption => ({
    id: nextId("option"),
    title: `Hotel Option ${number}`,
    expanded: true,
    cities: [createCity(0)],
  });

  const [options, setOptions] = useState<HotelOption[]>(() => [createOption(1)]);
  const showCosting = showsHotelCostingFields(supplierType);
  const onHotelsChangeRef = useRef(onHotelsChange);
  onHotelsChangeRef.current = onHotelsChange;

  useEffect(() => {
    onHotelsChangeRef.current?.(options);
  }, [options]);

  const { data: hotelsResponse } = useGetHotelsQuery(null);
  const { data: areasResponse } = useGetAreasQuery({ city: "", area: "" });
  const { data: suppliersResponse } = useGetSuppliersQuery(undefined);

  const hotels: HotelRecord[] = hotelsResponse?.data || [];
  const areas: AreaRecord[] = areasResponse?.data || [];
  const suppliers: SupplierRecord[] = suppliersResponse?.data || [];

  const cityOptions = useMemo(() => {
    const fromDestinations = parseDestinations(destinationsCovered);
    const fromAreas = areas.map((area) => area.city).filter(Boolean);
    const fromHotels = hotels.map((hotel) => hotel.cityName).filter(Boolean);
    return Array.from(new Set([...fromDestinations, ...fromAreas, ...fromHotels]));
  }, [destinationsCovered, areas, hotels]);

  useEffect(() => {
    const first = parseDestinations(destinationsCovered)[0];
    if (!first) return;
    setOptions((prev) =>
      prev.map((option) => ({
        ...option,
        cities: option.cities.map((city, index) =>
          index === 0 && !city.hotelCity ? { ...city, hotelCity: first } : city
        ),
      }))
    );
  }, [destinationsCovered]);

  const updateCity = (
    optionId: string,
    cityId: string,
    updater: (city: HotelCity) => HotelCity
  ) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id !== optionId
          ? option
          : {
              ...option,
              cities: option.cities.map((city) =>
                city.id !== cityId ? city : computeCityTotals(updater(city))
              ),
            }
      )
    );
  };

  const hotelsForCity = (cityName: string) =>
    hotels.filter((hotel) => !cityName || cityMatches(hotel.cityName, cityName));

  const handleHotelNameChange = (city: HotelCity, value: string, optionId: string) => {
    const match = hotelsForCity(city.hotelCity).find(
      (hotel) => hotel.hotelName.toLowerCase() === value.toLowerCase()
    );
    updateCity(optionId, city.id, (current) => ({
      ...current,
      hotelName: withSimilarName(value, current.similarHotel),
      hotelId: match?._id || "",
      rooms: current.rooms.map((room, index) =>
        index === 0 && match?.roomType
          ? { ...room, roomType: match.roomType }
          : room
      ),
    }));
  };

  const copyCostToAllRooms = (optionId: string, city: HotelCity, room: HotelRoom) => {
    updateCity(optionId, city.id, (current) => ({
      ...current,
      rooms: current.rooms.map((item) => ({
        ...item,
        costPerRoomNight: room.costPerRoomNight,
        roomCostNight: room.roomCostNight || room.costPerRoomNight,
      })),
    }));
  };

  const removeOption = (optionId: string) => {
    setOptions((prev) => {
      if (prev.length <= 1) return prev;
      return prev
        .filter((item) => item.id !== optionId)
        .map((item, index) => ({
          ...item,
          title: `Hotel Option ${index + 1}`,
        }));
    });
  };

  return (
    <>
      {options.map((option) => (
        <CollapsibleSection
          key={option.id}
          title={option.title}
          headerVariant="blue"
          expanded={option.expanded}
          onToggle={() =>
            setOptions((prev) =>
              prev.map((item) =>
                item.id === option.id
                  ? { ...item, expanded: !item.expanded }
                  : item
              )
            )
          }
          flush
          toggleIcon="chevron"
          actions={
            options.length > 1 ? (
              <button
                type="button"
                className="ccp-option-delete-btn"
                aria-label={`Delete ${option.title}`}
                onClick={() => removeOption(option.id)}
              >
                <IconifyIcon icon="mdi:delete" />
              </button>
            ) : null
          }
        >
          {option.cities.map((city, cityIndex) => {
            const cityHotels = hotelsForCity(city.hotelCity);
            const roomTypes = Array.from(
              new Set([
                ...ROOM_TYPES,
                ...cityHotels.map((hotel) => hotel.roomType).filter(Boolean),
                ...city.rooms.map((room) => room.roomType).filter(Boolean),
              ])
            ) as string[];

            return (
              <div key={city.id} className="ccp-city-block">
                <div className="ccp-city-header">
                  <div className="ccp-city-header-left">
                    <span>CITY {cityIndex + 1}</span>
                    <Form.Check
                      type="checkbox"
                      id={`${city.id}-self-booked`}
                      label="Self Booked"
                      checked={city.selfBooked}
                      onChange={(e) =>
                        updateCity(option.id, city.id, (current) => ({
                          ...current,
                          selfBooked: e.target.checked,
                        }))
                      }
                      className="ccp-city-check mb-0"
                    />
                    {showCosting && (
                      <Form.Check
                        type="checkbox"
                        id={`${city.id}-room-wise`}
                        label="Room Wise Costing"
                        checked={city.roomWiseCosting}
                        onChange={(e) =>
                          updateCity(option.id, city.id, (current) => ({
                            ...current,
                            roomWiseCosting: e.target.checked,
                          }))
                        }
                        className="ccp-city-check mb-0"
                      />
                    )}
                  </div>
                  {option.cities.length > 0 && (
                    <button
                      type="button"
                      className="ccp-city-delete-btn"
                      aria-label={`Delete city ${cityIndex + 1}`}
                      onClick={() =>
                        setOptions((prev) =>
                          prev.map((item) => {
                            if (item.id !== option.id) return item;
                            if (item.cities.length === 1) {
                              return { ...item, cities: [createCity(0)] };
                            }
                            return {
                              ...item,
                              cities: item.cities.filter(
                                (entry) => entry.id !== city.id
                              ),
                            };
                          })
                        )
                      }
                    >
                      <IconifyIcon icon="mdi:delete" />
                    </button>
                  )}
                </div>

                <div className="ccp-city-body">
                  <div
                    className={`ccp-hotel-fields ${
                      showCosting ? "with-costing" : "package-only"
                    }`}
                  >
                    <div>
                      <label className="ccp-field-label">
                        Hotel City <span className="text-danger">*</span>
                      </label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        list={`${city.id}-cities`}
                        value={city.hotelCity}
                        placeholder="Select city"
                        onChange={(e) =>
                          updateCity(option.id, city.id, (current) => ({
                            ...current,
                            hotelCity: e.target.value,
                            hotelId: "",
                            hotelName: current.similarHotel
                              ? withSimilarName("", true)
                              : "",
                          }))
                        }
                      />
                      <datalist id={`${city.id}-cities`}>
                        {cityOptions.map((name) => (
                          <option key={name} value={name} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="ccp-field-label">Check In</label>
                      <Form.Control
                        size="sm"
                        type="date"
                        className="ccp-input"
                        value={city.checkIn}
                        onChange={(e) =>
                          updateCity(option.id, city.id, (current) => ({
                            ...current,
                            checkIn: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">
                        No. of Nights <span className="text-danger">*</span>
                      </label>
                      <Form.Control
                        size="sm"
                        type="number"
                        min={1}
                        className="ccp-input"
                        value={city.nights}
                        onChange={(e) =>
                          updateCity(option.id, city.id, (current) => ({
                            ...current,
                            nights: Number(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="ccp-hotel-name-cell">
                      <label className="ccp-field-label">
                        Hotel Name <span className="text-danger">*</span>
                      </label>
                      {city.hotelSource === "manual" ? (
                        <Form.Control
                          size="sm"
                          className="ccp-input"
                          placeholder="Enter hotel name"
                          value={city.hotelName}
                          onChange={(e) =>
                            updateCity(option.id, city.id, (current) => ({
                              ...current,
                              hotelId: "",
                              hotelName: withSimilarName(
                                e.target.value,
                                current.similarHotel
                              ),
                            }))
                          }
                        />
                      ) : (
                        <>
                          <Form.Control
                            size="sm"
                            className="ccp-input"
                            list={`${city.id}-hotels`}
                            placeholder="Search hotel"
                            value={city.hotelName}
                            onChange={(e) =>
                              handleHotelNameChange(
                                city,
                                e.target.value,
                                option.id
                              )
                            }
                          />
                          <datalist id={`${city.id}-hotels`}>
                            {cityHotels.map((hotel) => (
                              <option key={hotel._id} value={hotel.hotelName} />
                            ))}
                          </datalist>
                        </>
                      )}
                    </div>
                    <div className="ccp-hotel-inline-actions">
                      <Form.Check
                        type="checkbox"
                        id={`${city.id}-similar`}
                        label="Similar Hotel"
                        checked={city.similarHotel}
                        onChange={(e) =>
                          updateCity(option.id, city.id, (current) => ({
                            ...current,
                            similarHotel: e.target.checked,
                            hotelName: withSimilarName(
                              current.hotelName,
                              e.target.checked
                            ),
                          }))
                        }
                        className="ccp-similar-check mb-0"
                      />
                      <button
                        type="button"
                        className="ccp-hotel-manual-btn"
                        onClick={() =>
                          updateCity(option.id, city.id, (current) => ({
                            ...current,
                            hotelSource: "manual",
                            hotelId: "",
                          }))
                        }
                      >
                        Add Hotel Manually
                      </button>
                      {showCosting && (
                        <button
                          type="button"
                          className="ccp-hotel-inventory-btn"
                          onClick={() =>
                            updateCity(option.id, city.id, (current) => ({
                              ...current,
                              hotelSource: "inventory",
                            }))
                          }
                        >
                          Inventory/API
                        </button>
                      )}
                    </div>
                    {showCosting && (
                      <>
                        <div>
                          <label className="ccp-field-label">
                            Supplier <span className="text-danger">*</span>
                          </label>
                          <Form.Select
                            size="sm"
                            className="ccp-input"
                            value={city.supplierId}
                            onChange={(e) => {
                              const selected = suppliers.find(
                                (item) => item._id === e.target.value
                              );
                              updateCity(option.id, city.id, (current) => ({
                                ...current,
                                supplierId: e.target.value,
                                supplierName: selected?.companyName || "",
                                currency:
                                  selected?.currencyType || current.currency,
                              }));
                            }}
                          >
                            <option value="">Select</option>
                            {suppliers.map((supplier) => (
                              <option key={supplier._id} value={supplier._id}>
                                {supplier.companyName || "Supplier"}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                        <div>
                          <label className="ccp-field-label">
                            Currency <span className="text-danger">*</span>
                          </label>
                          <Form.Select
                            size="sm"
                            className="ccp-input"
                            value={city.currency}
                            onChange={(e) =>
                              updateCity(option.id, city.id, (current) => ({
                                ...current,
                                currency: e.target.value,
                              }))
                            }
                          >
                            {CURRENCIES.map((code) => (
                              <option key={code} value={code}>
                                {code}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </>
                    )}
                  </div>

                  {city.rooms.map((room, roomIndex) => {
                    const isLastRoom = roomIndex === city.rooms.length - 1;
                    return (
                    <div key={room.id} className="ccp-room-row">
                      <div className="ccp-room-label">Room {roomIndex + 1}</div>
                      <div
                        className={`ccp-room-fields ${
                          showCosting && city.roomWiseCosting
                            ? "with-costing"
                            : "package-only"
                        }`}
                      >
                        <div>
                          <label className="ccp-field-label">
                            Room Sharing <span className="text-danger">*</span>
                          </label>
                          <Form.Select
                            size="sm"
                            className="ccp-input"
                            value={room.sharing}
                            onChange={(e) =>
                              updateCity(option.id, city.id, (current) => ({
                                ...current,
                                rooms: current.rooms.map((item) =>
                                  item.id === room.id
                                    ? { ...item, sharing: e.target.value }
                                    : item
                                ),
                              }))
                            }
                          >
                            {ROOM_SHARING.map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                          </Form.Select>
                        </div>
                        <div>
                          <label className="ccp-field-label">
                            Room Type <span className="text-danger">*</span>
                          </label>
                          <Form.Control
                            size="sm"
                            className="ccp-input"
                            list={`${room.id}-types`}
                            value={room.roomType}
                            onChange={(e) =>
                              updateCity(option.id, city.id, (current) => ({
                                ...current,
                                rooms: current.rooms.map((item) =>
                                  item.id === room.id
                                    ? { ...item, roomType: e.target.value }
                                    : item
                                ),
                              }))
                            }
                          />
                          <datalist id={`${room.id}-types`}>
                            {roomTypes.map((type) => (
                              <option key={type} value={type} />
                            ))}
                          </datalist>
                        </div>
                        <div>
                          <label className="ccp-field-label">
                            Meal Plan <span className="text-danger">*</span>
                          </label>
                          <Form.Select
                            size="sm"
                            className="ccp-input"
                            value={room.mealPlan}
                            onChange={(e) =>
                              updateCity(option.id, city.id, (current) => ({
                                ...current,
                                rooms: current.rooms.map((item) =>
                                  item.id === room.id
                                    ? { ...item, mealPlan: e.target.value }
                                    : item
                                ),
                              }))
                            }
                          >
                            {MEAL_PLANS.map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                          </Form.Select>
                        </div>
                        {showCosting && city.roomWiseCosting ? (
                          <>
                            <div>
                              <label className="ccp-field-label">
                                Adult | Cost / Room / Night
                              </label>
                              <div className="ccp-adult-cost">
                                <Form.Select
                                  size="sm"
                                  className="ccp-input ccp-adult-select"
                                  value={room.adults}
                                  onChange={(e) =>
                                    updateCity(option.id, city.id, (current) => ({
                                      ...current,
                                      rooms: current.rooms.map((item) =>
                                        item.id === room.id
                                          ? {
                                              ...item,
                                              adults: Number(e.target.value),
                                            }
                                          : item
                                      ),
                                    }))
                                  }
                                >
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                    (count) => (
                                      <option key={count} value={count}>
                                        {count}
                                      </option>
                                    )
                                  )}
                                </Form.Select>
                                <div className="ccp-cost-night">
                                  <Form.Control
                                    size="sm"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    className="ccp-input"
                                    value={room.costPerRoomNight}
                                    onChange={(e) => {
                                      const rate = Number(e.target.value) || 0;
                                      updateCity(option.id, city.id, (current) => ({
                                        ...current,
                                        rooms: current.rooms.map((item) =>
                                          item.id === room.id
                                            ? {
                                                ...item,
                                                costPerRoomNight: rate,
                                                roomCostNight: rate,
                                              }
                                            : item
                                        ),
                                      }));
                                    }}
                                  />
                                  <span>/ Night</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="ccp-field-label">
                                Room Cost / Night
                              </label>
                              <Form.Control
                                size="sm"
                                type="number"
                                min={0}
                                step="0.01"
                                className="ccp-input"
                                value={room.roomCostNight}
                                onChange={(e) => {
                                  const rate = Number(e.target.value) || 0;
                                  updateCity(option.id, city.id, (current) => ({
                                    ...current,
                                    rooms: current.rooms.map((item) =>
                                      item.id === room.id
                                        ? { ...item, roomCostNight: rate }
                                        : item
                                    ),
                                  }));
                                }}
                              />
                            </div>
                            <div className="ccp-room-actions">
                              <Form.Check
                                type="checkbox"
                                id={`${room.id}-copy`}
                                label="Copy to All"
                                className="ccp-copy-check mb-0"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    copyCostToAllRooms(option.id, city, room);
                                  }
                                }}
                              />
                              {isLastRoom && (
                                <button
                                  type="button"
                                  className="btn btn-link p-0 text-primary ccp-add-room-link"
                                  onClick={() =>
                                    updateCity(option.id, city.id, (current) => ({
                                      ...current,
                                      rooms: [...current.rooms, createRoom()],
                                    }))
                                  }
                                >
                                  Add Room
                                </button>
                              )}
                              {city.rooms.length > 1 && (
                                <button
                                  type="button"
                                  className="ccp-room-delete-link"
                                  aria-label={`Delete room ${roomIndex + 1}`}
                                  onClick={() =>
                                    updateCity(option.id, city.id, (current) => ({
                                      ...current,
                                      rooms: current.rooms.filter(
                                        (item) => item.id !== room.id
                                      ),
                                    }))
                                  }
                                >
                                  <IconifyIcon icon="mdi:delete-outline" />
                                </button>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="ccp-field-label">Adult</label>
                              <Form.Select
                                size="sm"
                                className="ccp-input"
                                value={room.adults}
                                onChange={(e) =>
                                  updateCity(option.id, city.id, (current) => ({
                                    ...current,
                                    rooms: current.rooms.map((item) =>
                                      item.id === room.id
                                        ? {
                                            ...item,
                                            adults: Number(e.target.value),
                                          }
                                        : item
                                    ),
                                  }))
                                }
                              >
                                {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                  (count) => (
                                    <option key={count} value={count}>
                                      {count}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </div>
                            <div className="ccp-room-actions">
                              <label className="ccp-field-label">Action</label>
                              {isLastRoom && (
                                <button
                                  type="button"
                                  className="btn btn-link p-0 text-primary ccp-add-room-link"
                                  onClick={() =>
                                    updateCity(option.id, city.id, (current) => ({
                                      ...current,
                                      rooms: [...current.rooms, createRoom()],
                                    }))
                                  }
                                >
                                  Add Room
                                </button>
                              )}
                              {city.rooms.length > 1 && (
                                <button
                                  type="button"
                                  className="ccp-room-delete-link"
                                  aria-label={`Delete room ${roomIndex + 1}`}
                                  onClick={() =>
                                    updateCity(option.id, city.id, (current) => ({
                                      ...current,
                                      rooms: current.rooms.filter(
                                        (item) => item.id !== room.id
                                      ),
                                    }))
                                  }
                                >
                                  <IconifyIcon icon="mdi:delete-outline" />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    );
                  })}

                  {showCosting && city.roomWiseCosting && (
                    <div className="ccp-hotel-totals">
                      <div>
                        <label className="ccp-field-label">Hotel Tax %</label>
                        <Form.Control
                          size="sm"
                          type="number"
                          min={0}
                          className="ccp-input"
                          value={city.hotelTaxPercent}
                          onChange={(e) =>
                            updateCity(option.id, city.id, (current) => ({
                              ...current,
                              hotelTaxPercent: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="ccp-field-label">Tax Amount</label>
                        <Form.Control
                          size="sm"
                          className="ccp-input"
                          readOnly
                          value={formatMoney(city.taxAmount)}
                        />
                      </div>
                      <div>
                        <label className="ccp-field-label">Total Cost</label>
                        <Form.Control
                          size="sm"
                          className="ccp-input"
                          readOnly
                          value={formatMoney(city.totalCost)}
                        />
                      </div>
                      <div>
                        <label className="ccp-field-label">
                          Total Markup{" "}
                          <IconifyIcon
                            icon="mdi:information-outline"
                            className="text-primary"
                          />
                        </label>
                        <div className="d-flex align-items-center gap-1">
                          <Form.Check
                            type="checkbox"
                            checked={city.markupEnabled}
                            onChange={(e) =>
                              updateCity(option.id, city.id, (current) => ({
                                ...current,
                                markupEnabled: e.target.checked,
                              }))
                            }
                            className="mb-0"
                          />
                          <Form.Control
                            size="sm"
                            type="number"
                            min={0}
                            className="ccp-input"
                            value={city.totalMarkup}
                            onChange={(e) =>
                              updateCity(option.id, city.id, (current) => ({
                                ...current,
                                totalMarkup: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="ccp-field-label">Final Cost</label>
                        <Form.Control
                          size="sm"
                          className="ccp-input"
                          readOnly
                          value={formatMoney(city.finalCost)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="ccp-city-footer">
            <button
              type="button"
              className="ccp-orange-btn"
              onClick={() =>
                setOptions((prev) =>
                  prev.map((item) =>
                    item.id !== option.id
                      ? item
                      : {
                          ...item,
                          cities: [
                            ...item.cities,
                            createCity(
                              item.cities.length,
                              item.cities[item.cities.length - 1]
                            ),
                          ],
                        }
                  )
                )
              }
            >
              Add City
            </button>
          </div>
        </CollapsibleSection>
      ))}

      <div className="text-end mb-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          style={{ fontSize: "11px" }}
          onClick={() =>
            setOptions((prev) => [...prev, createOption(prev.length + 1)])
          }
        >
          Add More Options
        </button>
      </div>
    </>
  );
};

export default HotelOptionSection;
