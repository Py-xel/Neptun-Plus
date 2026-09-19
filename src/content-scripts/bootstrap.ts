import { initializeStatus } from '@/content-scripts/Status';
import { initializeDisableHeaders } from '@/content-scripts/interface/DisableHeaders';
import { initializeFileDownloader } from '@/content-scripts/interface/FileDownloader';
import { initializeItemList } from '@/content-scripts/interface/ItemList';
import { initializeShortcuts } from '@/content-scripts/interface/Shortcuts';
import { initializeAutoLogin } from '@/content-scripts/system/AutoLogin';
import { waitForDOM, waitForLoading } from '@/utils/utility';

async function bootstrap(): Promise<void> {
  await waitForDOM();
  await waitForLoading('#loading-placeholder-index', 'none');

  await initializeStatus();
  await initializeDisableHeaders();
  await initializeItemList();
  await initializeFileDownloader();
  await initializeShortcuts();
  await initializeAutoLogin();
}

void bootstrap();
