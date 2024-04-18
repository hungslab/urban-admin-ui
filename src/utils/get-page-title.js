import defaultSettings from '@/settings'

const title = defaultSettings.title || 'real 商城管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
