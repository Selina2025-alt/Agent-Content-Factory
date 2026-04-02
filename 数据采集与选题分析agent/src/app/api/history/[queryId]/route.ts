import { NextResponse } from "next/server";

import {
  createMonitoringRepository,
  getAnalysisSnapshotBySearchQuery,
  getSearchQueryById,
  listCollectedContentsBySearchQuery
} from "@/lib/db/monitoring-repository";

export async function GET(
  _request: Request,
  context: { params: Promise<{ queryId: string }> }
) {
  const { queryId } = await context.params;
  const repository = createMonitoringRepository();

  try {
    const query = getSearchQueryById(repository, queryId);

    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    const analysis = getAnalysisSnapshotBySearchQuery(repository, queryId);
    const items = listCollectedContentsBySearchQuery(repository, { searchQueryId: queryId });

    return NextResponse.json({ query, analysis, items });
  } finally {
    repository.database.close();
  }
}
