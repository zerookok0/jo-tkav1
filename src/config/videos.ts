import type { WithId } from './types'

export type VideoItem = WithId & {
  /** 视频直链（.mp4） */
  src: string
  /** 封面图，留空则取视频首帧 */
  poster: string
  name: string
  avatar: string
  caption: string
  tags: string[]
  music: string
  /** 距离（km） */
  distanceKm: number
  postedAt: string
  likes: number
  comments: number
  saves: number
  shares: number
  /** 角标，留空不显示 */
  badge: string
}

const pexelsPoster = (id: number) =>
  `https://images.pexels.com/videos/${id}/pictures/preview-0.jpeg?auto=compress&cs=tinysrgb&w=720`

const pexelsVideo = (id: number) =>
  `https://videos.pexels.com/video-files/${id}/${id}-hd_1080_1920_30fps.mp4`

const avatar = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop`

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    src: pexelsVideo(7515915),
    poster: pexelsPoster(7515915),
    name: '夜色收集者',
    avatar: avatar(415829),
    caption: '凌晨一点的街，风比白天温柔一点。',
    tags: ['#深夜漫游', '#城市夜景'],
    music: '原声 · 夜色收集者',
    distanceKm: 0.62,
    postedAt: '12 分钟前',
    likes: 128400,
    comments: 2841,
    saves: 6120,
    shares: 9602,
    badge: '附近热门',
  },
  {
    id: 'v2',
    src: pexelsVideo(2795405),
    poster: pexelsPoster(2795405),
    name: 'Mia_',
    avatar: avatar(774909),
    caption: '今天的光刚刚好，随手一拍就是氛围感。',
    tags: ['#氛围感', '#日常碎片'],
    music: 'Slow Motion · Beat Lab',
    distanceKm: 1.2,
    postedAt: '28 分钟前',
    likes: 86200,
    comments: 1903,
    saves: 3410,
    shares: 4410,
    badge: '',
  },
  {
    id: 'v3',
    src: pexelsVideo(4434242),
    poster: pexelsPoster(4434242),
    name: '阿岚',
    avatar: avatar(1181686),
    caption: '周末的露台，一杯冰的，什么都不想。',
    tags: ['#周末计划', '#松弛感'],
    music: 'Sunday Vibe · 独立音乐',
    distanceKm: 1.8,
    postedAt: '1 小时前',
    likes: 243700,
    comments: 5120,
    saves: 12800,
    shares: 12800,
    badge: '本周飙升',
  },
  {
    id: 'v4',
    src: pexelsVideo(8815559),
    poster: pexelsPoster(8815559),
    name: 'Kai',
    avatar: avatar(1239291),
    caption: '训练第 41 天，身体比闹钟更准时。',
    tags: ['#自律打卡', '#训练日常'],
    music: 'Push It · Gym Mix',
    distanceKm: 2.4,
    postedAt: '1 小时前',
    likes: 54900,
    comments: 1204,
    saves: 2180,
    shares: 2870,
    badge: '',
  },
  {
    id: 'v5',
    src: pexelsVideo(5708830),
    poster: pexelsPoster(5708830),
    name: '软糖不加糖',
    avatar: avatar(1382731),
    caption: '第一次尝试这个转场，会不会有点上头。',
    tags: ['#转场挑战', '#剪辑练习'],
    music: 'Neon Drive · Synthwave',
    distanceKm: 3.1,
    postedAt: '2 小时前',
    likes: 392100,
    comments: 8420,
    saves: 20100,
    shares: 20100,
    badge: '挑战进行中',
  },
  {
    id: 'v6',
    src: pexelsVideo(5320011),
    poster: pexelsPoster(5320011),
    name: '南风',
    avatar: avatar(1130626),
    caption: '把今天的云存进相册，怕明天就忘了。',
    tags: ['#天空收藏', '#慢生活'],
    music: 'Cloud Nine · Ambient',
    distanceKm: 3.6,
    postedAt: '3 小时前',
    likes: 71200,
    comments: 1460,
    saves: 3020,
    shares: 3300,
    badge: '',
  },
]
