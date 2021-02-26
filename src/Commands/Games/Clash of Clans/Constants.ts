import axios from "axios";

/**
 * [Clash of Clans API Documentation](https://developer.clashofclans.com/#/documentation)
 */
export enum ENDPOINTS {
    BASE_URL = "https://api.clashofclans.com/v1",
    PLAYERS = "players",
    LOCATIONS = "locations",
    LEAGUES = "leagues",
    CLANS = "clans",
    LABELS = "labels"
};

export const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImE3NDQ2N2RlLTNjN2QtNDZlMi05NzQ2LTZlY2ZlMDkxNTVlZCIsImlhdCI6MTYxNDI1MTA1MCwic3ViIjoiZGV2ZWxvcGVyLzdlNDVlYzdiLTlhYTMtNGFkOC03MGI3LTNlOGRhYzVmOGY3ZiIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjkzLjI1Mi4xMy4xNjMiXSwidHlwZSI6ImNsaWVudCJ9XX0.92B7FW07mBAQGnWi7HbNzTWzmZkoQU03Js4GTFi0DkQv4KXbr4Hs_KOyuPw8EaZqtRdwUd_N7LlA0dvUBgpUFQ"
};

export const cocEmoji = "<:clash_of_clans:813824417602732043>";

export const manager = `${cocEmoji} Clash of Clans Manager`;

export async function isLocation(location: string, isCountry?: boolean): Promise<number> {
    const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.LOCATIONS}`, {
        headers: headers,
        method: "GET"
    });
    if (response.status != 200) return null;
    const locations: Array<{
        localizedName?: string,
        name: string,
        id: number,
        isCountry: boolean,
        countryCode?: string
    }> = response.data.items;
    if (locations.findIndex(loc => (loc.name.toLowerCase() == location.toLowerCase() || loc.countryCode?.toLowerCase() == location.toLowerCase()) && (typeof isCountry != "undefined" ? loc.isCountry == isCountry : true)) != -1) return locations[locations.findIndex(loc => loc.name.toLowerCase() == location.toLowerCase() || loc.countryCode?.toLowerCase() == location.toLowerCase())].id;
    else return null;
};

export async function getLocation(locationID: number): Promise<{
    localizedName?: string,
    name: string,
    id: number,
    isCountry: boolean,
    countryCode?: string
}> {
    const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.LOCATIONS}/${locationID}`, {
        headers: headers,
        method: "GET"
    });
    if (response.status == 200) {
        return await response.data;
    } else return null;
};