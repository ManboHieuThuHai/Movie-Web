import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const ALLOWED_PATH = /^\/(movie|tv|search|trending)(\/|$)/;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const path = requestUrl.searchParams.get("path");
  const token = process.env.TMDB_API_READ_TOKEN;

  if (!path || !ALLOWED_PATH.test(path)) {
    return NextResponse.json({ error: "Invalid TMDB path." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json(
      { error: "TMDB_API_READ_TOKEN is not configured." },
      { status: 500 },
    );
  }

  const tmdbUrl = new URL(`${TMDB_BASE_URL}${path}`);
  requestUrl.searchParams.forEach((value, key) => {
    if (key !== "path") {
      tmdbUrl.searchParams.set(key, value);
    }
  });

  try {
    const response = await fetch(tmdbUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 300 },
    });
    const data: unknown = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach TMDB." },
      { status: 502 },
    );
  }
}
