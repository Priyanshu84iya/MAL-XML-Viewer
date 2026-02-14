export interface AnimeEntry {
  series_animedb_id: string;
  series_title: string;
  series_type: string;
  series_episodes: string;
  my_watched_episodes: string;
  my_start_date: string;
  my_finish_date: string;
  my_score: string;
  my_status: string;
  my_priority: string;
  my_tags: string;
  my_times_watched: string;
  my_rewatch_value: string;
  my_rewatching: string;
  my_rewatching_ep: string;
  update_on_import: string;
}

export interface MyInfo {
  user_id: string;
  user_name: string;
  user_export_type: string;
  user_total_anime: string;
  user_total_watching: string;
  user_total_completed: string;
  user_total_onhold: string;
  user_total_dropped: string;
  user_total_plantowatch: string;
}

export interface MALData {
  myinfo: MyInfo;
  anime: AnimeEntry[];
  rawXml: string;
}

export type ViewMode = 'table' | 'cards';

export type StatusFilter = 'All' | 'Watching' | 'Completed' | 'On-Hold' | 'Dropped' | 'Plan to Watch';
export type ScoreFilter = 'All' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2' | '1';
export type TypeFilter = 'All' | 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' | 'Music';

export const STATUS_MAP: Record<string, string> = {
  'Watching': 'Watching',
  'Completed': 'Completed',
  'On-Hold': 'On-Hold',
  'Dropped': 'Dropped',
  'Plan to Watch': 'Plan to Watch',
};

export const STATUS_COLORS: Record<string, string> = {
  'Completed': '#39FF14',
  'Watching': '#FFE500',
  'Dropped': '#FF003C',
  'On-Hold': '#FF6B00',
  'Plan to Watch': '#FFFFFF',
};

export const STATUS_BG_CLASSES: Record<string, string> = {
  'Completed': 'bg-[#39FF14] text-black',
  'Watching': 'bg-[#FFE500] text-black',
  'Dropped': 'bg-[#FF003C] text-white',
  'On-Hold': 'bg-[#FF6B00] text-black',
  'Plan to Watch': 'bg-white text-black',
};
