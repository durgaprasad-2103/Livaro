"use server";

import type { AddressComponent, ClientLocation, Geometry } from "@/lib/types";

if (!process.env.GOOGLE_MAPS_API_KEY) {
  throw new Error(
    "Either you are running on client side or GOOGLE_MAPS_API_KEY is not set in environment variables"
  );
}

export const geocode = async (
  address?: string,
  components?: Record<keyof ClientLocation, string>
) => {
  if (!address && !components) {
    throw new Error(
      "Either address or components must be provided for geocoding"
    );
  }

  const params = new URLSearchParams();
  if (address) params.set("address", address);

  if (components) {
    const componentsJoined = Object.entries(components)
      .map(([key, value]) => `${key}:${value}`)
      .join("|");

    params.set("components", componentsJoined);
  }

  params.set("key", process.env.GOOGLE_MAPS_API_KEY!);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`
  );

  const body = await response.json();
  const results = body.results;
  if (!results || results.length === 0) {
    return null;
  }

  const { geometry } = results[0];
  return geometry as Geometry;
};

/**
 * Reverse geocode a latitude and longitude to a human-readable address.
 *
 * @param lat
 * @param lng
 */
export const reverseGeocode = async (lat: number, lng: number) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );

  const body = await response.json();
  const results = body.results;
  if (!results || results.length === 0) {
    return null;
  }

  const standardAddress = results[0];
  const addressComponents = standardAddress.address_components.reduce(
    (acc: Record<string, AddressComponent>, component: AddressComponent) => {
      const types = component.types;
      if (types && types.length > 0) {
        const type = types[0];
        let encodedType = type;
        switch (type) {
          case "route":
            encodedType = "street";
            break;
          case "locality":
            encodedType = "city";
            break;
          case "administrative_area_level_1":
            encodedType = "state";
            break;
          case "administrative_area_level_2":
            encodedType = "county";
            break;
        }
        acc[encodedType] = component;
      }
      return acc;
    },
    {}
  );

  return addressComponents as ClientLocation;
};
