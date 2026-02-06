/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Announcements from './pages/Announcements';
import Applications from './pages/Applications';
import Calendar from './pages/Calendar';
import CollegeDetail from './pages/CollegeDetail';
import Colleges from './pages/Colleges';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RoleSelection from './pages/RoleSelection';
import CollegeDashboard from './pages/CollegeDashboard';
import CollegeSettings from './pages/CollegeSettings';
import ManageExamSlots from './pages/ManageExamSlots';
import CollegeApplications from './pages/CollegeApplications';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Announcements": Announcements,
    "Applications": Applications,
    "Calendar": Calendar,
    "CollegeDetail": CollegeDetail,
    "Colleges": Colleges,
    "Home": Home,
    "Profile": Profile,
    "RoleSelection": RoleSelection,
    "CollegeDashboard": CollegeDashboard,
    "CollegeSettings": CollegeSettings,
    "ManageExamSlots": ManageExamSlots,
    "CollegeApplications": CollegeApplications,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};