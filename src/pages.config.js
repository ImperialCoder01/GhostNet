import Home from './pages/Home';
import LinkScanner from './pages/LinkScanner';
import MessageScanner from './pages/MessageScanner';
import Profile from './pages/Profile';
import ReportScam from './pages/ReportScam';
import ScamHeatmap from './pages/ScamHeatmap';
import ScreenshotScanner from './pages/ScreenshotScanner';
import Technology from './pages/Technology';
import PrivacyCenter from './pages/PrivacyCenter';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Home": Home,
    "LinkScanner": LinkScanner,
    "MessageScanner": MessageScanner,
    "ScreenshotScanner": ScreenshotScanner,
    "ScamHeatmap": ScamHeatmap,
    "ReportScam": ReportScam,
    "Technology": Technology,
    "PrivacyCenter": PrivacyCenter,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};