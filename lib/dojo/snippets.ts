import type { CodeSnippet } from './types'

export const STATIC_SNIPPETS: CodeSnippet[] = [

  // ─── PYTHON ADVANCED ───

  {
    id: 'py-decorator-timer',
    title: 'Decorator @timer',
    category: 'python-advanced',
    difficulty: 'medium',
    language: 'python',
    tags: ['decorator', 'wrapper', 'timer', 'pipeline'],
    explanation: "Pattern essentiel pour logger le temps d'exécution de tes pipelines data sans polluer le code.",
    lineCount: 12,
    charCount: 0,
    code: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__}: {elapsed:.2f}s")
        return result
    return wrapper

@timer
def load_gps_data(path: str):
    return pl.read_parquet(path)`,
  },

  {
    id: 'py-decorator-retry',
    title: 'Decorator @retry',
    category: 'python-advanced',
    difficulty: 'medium',
    language: 'python',
    tags: ['decorator', 'retry', 'resilience', 'pipeline'],
    explanation: 'Rend tes pipelines résilients face aux erreurs réseau ou API instables.',
    lineCount: 14,
    charCount: 0,
    code: `import time
from functools import wraps

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator`,
  },

  {
    id: 'py-generator-parquet',
    title: 'Generator Parquet files',
    category: 'python-advanced',
    difficulty: 'medium',
    language: 'python',
    tags: ['generator', 'yield', 'parquet', 'memory'],
    explanation: 'Lire 100GB de Parquet sans exploser la RAM. yield charge un fichier à la fois.',
    lineCount: 10,
    charCount: 0,
    code: `from pathlib import Path
import polars as pl

def iter_parquet_zones(base_path: str, zones: list[str]):
    for zone in zones:
        zone_path = Path(base_path) / zone
        files = list(zone_path.glob("*.parquet"))
        for file in files:
            df = pl.read_parquet(file)
            yield zone, df

for zone, df in iter_parquet_zones("data/2025", ["0a", "0b"]):
    process_zone(zone, df)`,
  },

  {
    id: 'py-context-manager',
    title: 'Context Manager DB',
    category: 'python-advanced',
    difficulty: 'hard',
    language: 'python',
    tags: ['context-manager', 'with', 'cleanup'],
    explanation: 'Garantit la libération des ressources (connexions DB, fichiers) même si une exception survient.',
    lineCount: 13,
    charCount: 0,
    code: `from contextlib import contextmanager
import psycopg2

@contextmanager
def get_db_connection(dsn: str):
    conn = psycopg2.connect(dsn)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

with get_db_connection(DSN) as conn:
    cursor = conn.cursor()`,
  },

  {
    id: 'py-dataclass',
    title: 'Dataclass Visit',
    category: 'python-basics',
    difficulty: 'easy',
    language: 'python',
    tags: ['dataclass', 'typing', 'model'],
    explanation: 'Modélise tes données avec typage fort. Bien mieux que des dicts non typés.',
    lineCount: 12,
    charCount: 0,
    code: `from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Visit:
    vehicle_id: str
    entry_time: datetime
    exit_time: datetime
    origin_lat: float
    origin_lon: float
    dest_lat: float
    dest_lon: float
    duration_min: float = field(init=False)

    def __post_init__(self):
        delta = self.exit_time - self.entry_time
        self.duration_min = delta.total_seconds() / 60`,
  },

  // ─── POLARS ───

  {
    id: 'polars-lazy-filter',
    title: 'Polars lazy filter GPS',
    category: 'polars',
    difficulty: 'medium',
    language: 'python',
    tags: ['polars', 'lazy', 'filter', 'gps', 'parquet'],
    explanation: 'scan_parquet ne charge rien en mémoire. collect() charge SEULEMENT les données filtrées.',
    lineCount: 10,
    charCount: 0,
    code: `import polars as pl

df = (
    pl.scan_parquet("data/2025/0a/*.parquet")
    .filter(
        pl.col("latitude").is_between(46.40, 46.42) &
        pl.col("longitude").is_between(-1.55, -1.53) &
        pl.col("speed").is_not_null()
    )
    .with_columns([
        pl.col("timestamp").cast(pl.Datetime),
        (pl.col("speed") * 3.6).alias("speed_kmh"),
    ])
    .collect()
)`,
  },

  {
    id: 'polars-groupby-agg',
    title: 'Polars GroupBy + Agg',
    category: 'polars',
    difficulty: 'medium',
    language: 'python',
    tags: ['polars', 'groupby', 'agg', 'statistics'],
    explanation: 'Calcule les stats par véhicule en une seule passe vectorisée. 10x plus rapide que Pandas.',
    lineCount: 10,
    charCount: 0,
    code: `vehicle_stats = (
    df
    .group_by("vehicle_id")
    .agg([
        pl.col("speed").mean().alias("avg_speed"),
        pl.col("speed").max().alias("max_speed"),
        pl.col("speed").std().alias("std_speed"),
        pl.col("timestamp").min().alias("first_seen"),
        pl.col("timestamp").max().alias("last_seen"),
        pl.count().alias("point_count"),
    ])
    .sort("point_count", descending=True)
)`,
  },

  {
    id: 'polars-window',
    title: 'Polars window over()',
    category: 'polars',
    difficulty: 'hard',
    language: 'python',
    tags: ['polars', 'window', 'over', 'rolling'],
    explanation: 'Équivalent des window functions SQL. Calcule une valeur par groupe sans réduire les lignes.',
    lineCount: 10,
    charCount: 0,
    code: `df = df.with_columns([
    pl.col("speed")
      .mean()
      .over("vehicle_id")
      .alias("vehicle_avg_speed"),

    pl.col("speed")
      .rolling_mean(window_size=5)
      .over("vehicle_id")
      .alias("speed_rolling_5"),

    pl.col("timestamp")
      .diff()
      .over("vehicle_id")
      .dt.total_seconds()
      .alias("time_diff_sec"),
])`,
  },

  // ─── GEOPANDAS ───

  {
    id: 'geo-point-in-polygon',
    title: 'Point-in-Polygon detection',
    category: 'geopandas',
    difficulty: 'medium',
    language: 'python',
    tags: ['geopandas', 'shapely', 'point-in-polygon', 'spatial'],
    explanation: 'Le cœur de ton projet laverie. Détecte si un point GPS est dans la zone cible.',
    lineCount: 14,
    charCount: 0,
    code: `import geopandas as gpd
from shapely.geometry import Point, Polygon

LAUNDRY_POLYGON = Polygon([
    (-1.5405, 46.4103),
    (-1.5398, 46.4103),
    (-1.5398, 46.4110),
    (-1.5405, 46.4110),
])

def detect_in_laundry(df):
    geometry = [Point(lon, lat) for lon, lat
                in zip(df["longitude"], df["latitude"])]
    gdf = gpd.GeoDataFrame(df, geometry=geometry, crs="EPSG:4326")
    gdf["in_laundry"] = gdf.geometry.within(LAUNDRY_POLYGON)
    return gdf`,
  },

  {
    id: 'geo-haversine',
    title: 'Distance Haversine',
    category: 'geopandas',
    difficulty: 'hard',
    language: 'python',
    tags: ['haversine', 'distance', 'gps', 'numpy'],
    explanation: 'Calcule la distance réelle entre deux points GPS en tenant compte de la courbure terrestre.',
    lineCount: 14,
    charCount: 0,
    code: `import numpy as np

def haversine_vectorized(
    lat1: np.ndarray, lon1: np.ndarray,
    lat2: np.ndarray, lon2: np.ndarray
) -> np.ndarray:
    R = 6371.0
    lat1, lon1 = np.radians(lat1), np.radians(lon1)
    lat2, lon2 = np.radians(lat2), np.radians(lon2)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = (np.sin(dlat/2)**2
         + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2)
    return R * 2 * np.arcsin(np.sqrt(a))`,
  },

  // ─── SQL ───

  {
    id: 'sql-window-lag',
    title: 'Window: LAG + ROW_NUMBER',
    category: 'sql-window',
    difficulty: 'medium',
    language: 'sql',
    tags: ['sql', 'window', 'lag', 'row_number', 'gps'],
    explanation: 'LAG récupère le point GPS précédent pour calculer la distance ou le delta temps.',
    lineCount: 14,
    charCount: 0,
    code: `SELECT
    vehicle_id,
    timestamp,
    latitude,
    longitude,
    speed,
    LAG(latitude)  OVER w AS prev_lat,
    LAG(longitude) OVER w AS prev_lon,
    LAG(timestamp) OVER w AS prev_ts,
    ROW_NUMBER()   OVER w AS point_num,
    COUNT(*)       OVER (PARTITION BY vehicle_id) AS total_points
FROM gps_points
WINDOW w AS (
    PARTITION BY vehicle_id
    ORDER BY timestamp
);`,
  },

  {
    id: 'sql-cte-visits',
    title: 'CTE: détection visites',
    category: 'sql-cte',
    difficulty: 'hard',
    language: 'sql',
    tags: ['sql', 'cte', 'visits', 'duration'],
    explanation: 'CTEs chaînées pour détecter les vrais arrêts: filtrer la zone, puis calculer la durée.',
    lineCount: 18,
    charCount: 0,
    code: `WITH points_in_zone AS (
    SELECT
        vehicle_id,
        timestamp,
        ST_Contains(
            ST_GeomFromText('POLYGON((-1.54 46.41,...))'),
            ST_Point(longitude, latitude)
        ) AS in_zone
    FROM gps_points
),
sessions AS (
    SELECT
        vehicle_id,
        MIN(timestamp) AS entry_time,
        MAX(timestamp) AS exit_time,
        EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) / 60
            AS duration_min
    FROM points_in_zone
    WHERE in_zone = TRUE
    GROUP BY vehicle_id
)
SELECT * FROM sessions
WHERE duration_min >= 5
ORDER BY entry_time;`,
  },

  {
    id: 'sql-od-matrix',
    title: 'Matrice Origin-Destination',
    category: 'sql-cte',
    difficulty: 'expert',
    language: 'sql',
    tags: ['sql', 'cte', 'od-matrix', 'mobility'],
    explanation: "La requête qui construit la matrice OD: d'où viennent les visiteurs et où vont-ils?",
    lineCount: 20,
    charCount: 0,
    code: `WITH visits AS (
    SELECT vehicle_id, entry_time, exit_time
    FROM detected_visits
),
origins AS (
    SELECT v.vehicle_id,
           g.latitude  AS orig_lat,
           g.longitude AS orig_lon
    FROM visits v
    JOIN gps_points g ON g.vehicle_id = v.vehicle_id
        AND g.timestamp = (
            SELECT MAX(timestamp) FROM gps_points
            WHERE vehicle_id = v.vehicle_id
              AND timestamp < v.entry_time
        )
),
od AS (
    SELECT o.vehicle_id,
           o.orig_lat, o.orig_lon,
           d.dest_lat, d.dest_lon
    FROM origins o
    JOIN destinations d USING (vehicle_id)
)
SELECT orig_zone, dest_zone, COUNT(*) AS flow
FROM od
GROUP BY orig_zone, dest_zone
ORDER BY flow DESC;`,
  },

  // ─── FASTAPI ───

  {
    id: 'fastapi-endpoint',
    title: 'FastAPI endpoint typé',
    category: 'fastapi',
    difficulty: 'medium',
    language: 'python',
    tags: ['fastapi', 'pydantic', 'endpoint', 'api'],
    explanation: 'Pattern FastAPI propre: Pydantic pour la validation, async pour la performance.',
    lineCount: 18,
    charCount: 0,
    code: `from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="GPS Mobility API")

class VisitResponse(BaseModel):
    vehicle_id: str
    entry_time: str
    exit_time: str
    duration_min: float
    origin_lat: float
    origin_lon: float

@app.get("/visits/{vehicle_id}", response_model=list[VisitResponse])
async def get_visits(
    vehicle_id: str,
    min_duration: Optional[float] = 5.0,
    db = Depends(get_db)
):
    visits = await db.fetch_visits(vehicle_id, min_duration)
    if not visits:
        raise HTTPException(status_code=404, detail="No visits found")
    return visits`,
  },

  // ─── DBT ───

  {
    id: 'dbt-model',
    title: 'dbt model: stg_gps_points',
    category: 'dbt',
    difficulty: 'medium',
    language: 'sql',
    tags: ['dbt', 'staging', 'model', 'sql'],
    explanation: 'Le staging model dbt: nettoie la source brute avant les transformations business.',
    lineCount: 16,
    charCount: 0,
    code: `{{ config(materialized='view') }}

WITH source AS (
    SELECT * FROM {{ source('raw', 'gps_points') }}
),

cleaned AS (
    SELECT
        vehicle_id,
        CAST(latitude  AS FLOAT) AS latitude,
        CAST(longitude AS FLOAT) AS longitude,
        CAST(speed     AS FLOAT) AS speed_ms,
        speed * 3.6              AS speed_kmh,
        CAST(timestamp AS TIMESTAMP) AS occurred_at,
        _loaded_at
    FROM source
    WHERE latitude  BETWEEN -90  AND 90
      AND longitude BETWEEN -180 AND 180
      AND speed >= 0
)

SELECT * FROM cleaned`,
  },

  // ─── DOCKER ───

  {
    id: 'docker-compose-data',
    title: 'Docker Compose: data stack',
    category: 'docker',
    difficulty: 'medium',
    language: 'yaml',
    tags: ['docker', 'compose', 'postgresql', 'postgis'],
    explanation: 'Stack data engineering locale: PostgreSQL + PostGIS + pgAdmin en un seul fichier.',
    lineCount: 24,
    charCount: 0,
    code: `version: '3.8'

services:
  db:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: gps_analytics
      POSTGRES_USER: nassim
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: nassim@entropy.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
    depends_on:
      - db

volumes:
  pgdata:`,
  },
]

STATIC_SNIPPETS.forEach(s => {
  s.charCount = s.code.length
})

export function getSnippetsByCategory(category: string): CodeSnippet[] {
  return STATIC_SNIPPETS.filter(s => s.category === category)
}

export function getSnippetsByDifficulty(difficulty: string): CodeSnippet[] {
  return STATIC_SNIPPETS.filter(s => s.difficulty === difficulty)
}

export function getRandomSnippet(exclude: string[] = [], difficulty?: string): CodeSnippet {
  let pool = STATIC_SNIPPETS.filter(s => !exclude.includes(s.id))
  if (difficulty) pool = pool.filter(s => s.difficulty === difficulty)
  if (pool.length === 0) pool = STATIC_SNIPPETS
  return pool[Math.floor(Math.random() * pool.length)]
}
