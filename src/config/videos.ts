import type { WithId } from './types'

export type VideoItem = WithId & {
  /** 视频直链（.mp4） */
  src: string
  /** 封面图，留空则自动取视频中段某一帧 */
  poster: string
  /**
   * 抓帧得到的候选封面（dataURL）。
   *
   * 有了它，「封面图 URL」就不再需要你手工去找图 ——
   * 在控制台点「抓 5 帧」，挑一张，写回 poster 即可。
   *
   * 存这里而不是 localStorage 单独一份，是为了跟着视频走：
   * 换顺序、删视频，候选图不会错位。
   */
  frameOptions?: string[]
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

const avatar = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop`

/** 可直接播放的示例源（已逐条验证过 206） */
const CLIP_A = 'https://videos.pexels.com/video-files/7515915/7515915-hd_1080_1920_30fps.mp4'
const CLIP_B = 'https://videos.pexels.com/video-files/8815559/8815559-hd_1080_1920_30fps.mp4'

/**
 * ────────────────────────────────────────────────────────────────
 *  示例视频
 * ────────────────────────────────────────────────────────────────
 *
 *  ⚠️ 这里的链接只用于本地预览，正式上线请换成自己的视频。
 *
 *  为什么只放两条：
 *  之前铺了六条，其中四条 Pexels 源已经 404 了 —— 页面看起来像
 *  「一直在加载」，其实是根本没有可播的文件。
 *  与其留一堆坏链接，不如只放两条验证过能播的，
 *  剩下的由你在控制台里加自己的视频。
 *
 *  也正因为这个，手机里现在加了「源失效」提示：
 *  以后再有链接挂掉，会明确写出来，而不是让你对着空白等。
 * ────────────────────────────────────────────────────────────────
 */
export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    src: CLIP_A,
    poster: '',
    name: 'رهف',
    avatar: avatar(415829),
    caption: 'شارع عبدون الساعة وحدة بالليل. الهوا ألطف من النهار.',
    tags: ['#عمّان_بالليل', '#أضواء_المدينة'],
    music: 'صوت أصلي · رهف',
    distanceKm: 0.62,
    postedAt: 'قبل 12 دقيقة',
    likes: 128400,
    comments: 2841,
    saves: 6120,
    shares: 9602,
    badge: 'الأقرب إلك',
  },
  {
    id: 'v2',
    src: CLIP_B,
    poster: '',
    name: 'زيد',
    avatar: avatar(1239291),
    caption: 'اليوم 41 بالجيم. جسمي أضبط من المنبّه.',
    tags: ['#التزام', '#تمرين'],
    music: 'تمرين · ميكس',
    distanceKm: 2.4,
    postedAt: 'قبل ساعة',
    likes: 54900,
    comments: 1204,
    saves: 2180,
    shares: 2870,
    badge: '',
  },
  {
    id: 'v3',
    src: CLIP_A,
    poster: '',
    name: 'لمى',
    avatar: avatar(774909),
    caption: 'سطح البيت بالجبيهة، كاسة شاي وولا شي على بالي.',
    tags: ['#هدوء_الليل', '#سطح_البيت'],
    music: 'ليل عمّان · إندي',
    distanceKm: 1.2,
    postedAt: 'قبل 28 دقيقة',
    likes: 86200,
    comments: 1903,
    saves: 3410,
    shares: 4410,
    badge: '',
  },
  {
    id: 'v4',
    src: CLIP_B,
    poster: '',
    name: 'دانة',
    avatar: avatar(1181686),
    caption: 'الدوار السابع فاضي، والليل حسّه غير.',
    tags: ['#عمّان', '#مشوار_ليلي'],
    music: 'دفّ الليل · إلكتروني',
    distanceKm: 1.8,
    postedAt: 'قبل ساعتين',
    likes: 243700,
    comments: 5120,
    saves: 12800,
    shares: 12800,
    badge: 'الأكثر تصاعدًا',
  },
]
