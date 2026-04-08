export type PlatformId = "wechat" | "xiaohongshu" | "twitter" | "videoScript";

export type TaskStatus = "draft" | "generating" | "ready" | "failed";
export type PublishStatus = "idle" | "publishing" | "published" | "failed";
export type TwitterMode = "auto" | "single" | "thread";
export type SkillSourceType = "zip" | "github";

export interface TaskRecord {
  id: string;
  title: string;
  userInput: string;
  selectedPlatforms: PlatformId[];
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WechatContentBody {
  title: string;
  summary: string;
  body: string;
}

export interface XiaohongshuContentBody {
  title: string;
  caption: string;
  imageSuggestions: string[];
  hashtags: string[];
}

export interface TwitterContentBody {
  mode: TwitterMode;
  tweets: string[];
}

export interface VideoScene {
  shot: string;
  visual: string;
  voiceover: string;
}

export interface VideoScriptContentBody {
  title: string;
  scenes: VideoScene[];
}

export interface GeneratedTaskContentBundle {
  wechat: WechatContentBody | null;
  xiaohongshu: XiaohongshuContentBody | null;
  twitter: TwitterContentBody | null;
  videoScript: VideoScriptContentBody | null;
}

export interface PlatformContentRecord {
  id: string;
  taskId: string;
  platform: PlatformId;
  contentType: string;
  title: string;
  bodyJson: string;
  publishStatus: PublishStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettingRecord {
  platform: PlatformId;
  baseRulesJson: string;
  enabledSkillIdsJson: string;
  updatedAt: string;
}

export interface SkillRecord {
  id: string;
  name: string;
  sourceType: SkillSourceType;
  sourceRef: string;
  summary: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
