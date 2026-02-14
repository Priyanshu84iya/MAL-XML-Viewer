import type { MALData, MyInfo, AnimeEntry } from './types';

function getTextContent(parent: Element, tagName: string): string {
  const el = parent.getElementsByTagName(tagName)[0];
  if (!el) return '';
  return el.textContent?.trim() ?? '';
}

export function parseMALXml(xmlString: string): MALData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Invalid XML file. Please upload a valid MAL export.');
  }

  const myinfoEl = doc.getElementsByTagName('myinfo')[0];
  if (!myinfoEl) {
    throw new Error('Missing <myinfo> element. Is this a MAL export?');
  }

  const myinfo: MyInfo = {
    user_id: getTextContent(myinfoEl, 'user_id'),
    user_name: getTextContent(myinfoEl, 'user_name'),
    user_export_type: getTextContent(myinfoEl, 'user_export_type'),
    user_total_anime: getTextContent(myinfoEl, 'user_total_anime'),
    user_total_watching: getTextContent(myinfoEl, 'user_total_watching'),
    user_total_completed: getTextContent(myinfoEl, 'user_total_completed'),
    user_total_onhold: getTextContent(myinfoEl, 'user_total_onhold'),
    user_total_dropped: getTextContent(myinfoEl, 'user_total_dropped'),
    user_total_plantowatch: getTextContent(myinfoEl, 'user_total_plantowatch'),
  };

  const animeNodes = doc.getElementsByTagName('anime');
  const anime: AnimeEntry[] = [];

  for (let i = 0; i < animeNodes.length; i++) {
    const node = animeNodes[i];
    anime.push({
      series_animedb_id: getTextContent(node, 'series_animedb_id'),
      series_title: getTextContent(node, 'series_title'),
      series_type: getTextContent(node, 'series_type'),
      series_episodes: getTextContent(node, 'series_episodes'),
      my_watched_episodes: getTextContent(node, 'my_watched_episodes'),
      my_start_date: getTextContent(node, 'my_start_date'),
      my_finish_date: getTextContent(node, 'my_finish_date'),
      my_score: getTextContent(node, 'my_score'),
      my_status: getTextContent(node, 'my_status'),
      my_priority: getTextContent(node, 'my_priority'),
      my_tags: getTextContent(node, 'my_tags'),
      my_times_watched: getTextContent(node, 'my_times_watched'),
      my_rewatch_value: getTextContent(node, 'my_rewatch_value'),
      my_rewatching: getTextContent(node, 'my_rewatching'),
      my_rewatching_ep: getTextContent(node, 'my_rewatching_ep'),
      update_on_import: getTextContent(node, 'update_on_import'),
    });
  }

  return { myinfo, anime, rawXml: xmlString };
}

export function exportToJson(data: MALData): string {
  const { rawXml: _raw, ...exportData } = data;
  return JSON.stringify(exportData, null, 2);
}

export function displayValue(value: string | undefined | null): string {
  if (!value || value.trim() === '' || value === '0000-00-00') return '--';
  return value;
}

export function computeStats(anime: AnimeEntry[]) {
  const completed = anime.filter(a => a.my_status === 'Completed');
  const scores = anime
    .map(a => parseInt(a.my_score, 10))
    .filter(s => s > 0);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const totalEpisodes = anime.reduce((sum, a) => sum + (parseInt(a.my_watched_episodes, 10) || 0), 0);

  return {
    totalCompleted: completed.length,
    averageScore: Math.round(avgScore * 100) / 100,
    totalEpisodes,
    totalScored: scores.length,
  };
}
