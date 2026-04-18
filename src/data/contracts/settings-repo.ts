import type { AppSkinSettings } from '../../core/types';

export interface SettingsRepository {
  get(): Promise<AppSkinSettings | null>;
  save(settings: Partial<AppSkinSettings>): Promise<AppSkinSettings>;
}
