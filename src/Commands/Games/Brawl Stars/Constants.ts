import axios from "axios";

/**
 * [Brawl Stars](https://developer.brawlstars.com/#/documentation)
 */
export const enum ENDPOINTS {
    BASE_URL = "https://api.brawlstars.com/v1",
    BRAWLERS = "brawlers"
};

export const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk4ODVlMzE2LWI1NmItNGUwYS1iOTM4LWVjMmI0OGU0N2FkNiIsImlhdCI6MTYxNDM2MjE3NCwic3ViIjoiZGV2ZWxvcGVyL2YxYzI5YzI4LWFlZmQtNWZmMC1mNzBhLWVlNjYzNjk0MzYwNSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiOTMuMjUyLjI2LjExNCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.Gy4ccLj0g1lbw6MXxvlEcKNKvVh5wFtscNOmgomv1MM6QGcU2YOm9gEjdS2Y5VAQ4c92k26q9uTRb_qd_A9uUw"
};

export const manager: string = "<:brawl_stars:814926752840941608> Brawl Stars Manager";