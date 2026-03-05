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
import AIEthics from './pages/AIEthics';
import AIIntegrationDocs from './pages/AIIntegrationDocs';
import AILearningCoach from './pages/AILearningCoach';
import AIRecommendationReviewDocs from './pages/AIRecommendationReviewDocs';
import AccessAudit from './pages/AccessAudit';
import AdaptiveLearningPath from './pages/AdaptiveLearningPath';
import AdminOperations from './pages/AdminOperations';
import Analytics from './pages/Analytics';
import AssignmentGenerator from './pages/AssignmentGenerator';
import Assignments from './pages/Assignments';
import AutoCurationDashboard from './pages/AutoCurationDashboard';
import BartleAssessment from './pages/BartleAssessment';
import Challenger from './pages/Challenger';
import ChallengerCourse from './pages/ChallengerCourse';
import ChurnPredictionGuide from './pages/ChurnPredictionGuide';
import ClassManagement from './pages/ClassManagement';
import ClassroomAnalytics from './pages/ClassroomAnalytics';
import CodeReview from './pages/CodeReview';
import ComprehensiveAssessment from './pages/ComprehensiveAssessment';
import ContentGapAnalysis from './pages/ContentGapAnalysis';
import ContentGaps from './pages/ContentGaps';
import ContentSprintDashboard from './pages/ContentSprintDashboard';
import CourseStructure from './pages/CourseStructure';
import Courses from './pages/Courses';
import CuriosityCourse from './pages/CuriosityCourse';
import CurriculumCriticalReview from './pages/CurriculumCriticalReview';
import Dashboard from './pages/Dashboard';
import DataVerification from './pages/DataVerification';
import DataVisualization from './pages/DataVisualization';
import DebugDashboard from './pages/DebugDashboard';
import Discovery from './pages/Discovery';
import DiscoveryCourse from './pages/DiscoveryCourse';
import DiscoveryProject from './pages/DiscoveryProject';
import Documentation from './pages/Documentation';
import DocumentationADR from './pages/DocumentationADR';
import DocumentationDeveloper from './pages/DocumentationDeveloper';
import EarlyWarningDashboard from './pages/EarlyWarningDashboard';
import EnvironmentDocs from './pages/EnvironmentDocs';
import FratozDashboard from './pages/FratozDashboard';
import Gamification from './pages/Gamification';
import GapsDemonstration from './pages/GapsDemonstration';
import InnAIReview from './pages/InnAIReview';
import LessonView from './pages/LessonView';
import ModuleView from './pages/ModuleView';
import MotivationalAssessment from './pages/MotivationalAssessment';
import NetworkDiagnostic from './pages/NetworkDiagnostic';
import Onboarding from './pages/Onboarding';
import ParentPortal from './pages/ParentPortal';
import Pioneer from './pages/Pioneer';
import PioneerCourse from './pages/PioneerCourse';
import PlatformComparison from './pages/PlatformComparison';
import PlatformStatus from './pages/PlatformStatus';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import PublicRoadmap from './pages/PublicRoadmap';
import ResourceValidation from './pages/ResourceValidation';
import Resources from './pages/Resources';
import ResourcesDashboard from './pages/ResourcesDashboard';
import ResourcesVerification from './pages/ResourcesVerification';
import RoadmapQ1 from './pages/RoadmapQ1';
import Schedule from './pages/Schedule';
import SecretsManagement from './pages/SecretsManagement';
import SecurityDocs from './pages/SecurityDocs';
import StrategicPivot from './pages/StrategicPivot';
import Syllabus from './pages/Syllabus';
import SystemHealth from './pages/SystemHealth';
import TeacherCertificationCourse from './pages/TeacherCertificationCourse';
import TeacherCertificationDashboard from './pages/TeacherCertificationDashboard';
import TeacherCertifications from './pages/TeacherCertifications';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherFeedbackReview from './pages/TeacherFeedbackReview';
import TeacherLessonPage from './pages/TeacherLessonPage';
import TeacherLessonTraining from './pages/TeacherLessonTraining';
import TeacherTraining from './pages/TeacherTraining';
import TechnicalGapsAnalysis from './pages/TechnicalGapsAnalysis';
import TenantDashboard from './pages/TenantDashboard';
import UserManagement from './pages/UserManagement';
import VARKAnalytics from './pages/VARKAnalytics';
import WeekZero from './pages/WeekZero';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIEthics": AIEthics,
    "AIIntegrationDocs": AIIntegrationDocs,
    "AILearningCoach": AILearningCoach,
    "AIRecommendationReviewDocs": AIRecommendationReviewDocs,
    "AccessAudit": AccessAudit,
    "AdaptiveLearningPath": AdaptiveLearningPath,
    "AdminOperations": AdminOperations,
    "Analytics": Analytics,
    "AssignmentGenerator": AssignmentGenerator,
    "Assignments": Assignments,
    "AutoCurationDashboard": AutoCurationDashboard,
    "BartleAssessment": BartleAssessment,
    "Challenger": Challenger,
    "ChallengerCourse": ChallengerCourse,
    "ChurnPredictionGuide": ChurnPredictionGuide,
    "ClassManagement": ClassManagement,
    "ClassroomAnalytics": ClassroomAnalytics,
    "CodeReview": CodeReview,
    "ComprehensiveAssessment": ComprehensiveAssessment,
    "ContentGapAnalysis": ContentGapAnalysis,
    "ContentGaps": ContentGaps,
    "ContentSprintDashboard": ContentSprintDashboard,
    "CourseStructure": CourseStructure,
    "Courses": Courses,
    "CuriosityCourse": CuriosityCourse,
    "CurriculumCriticalReview": CurriculumCriticalReview,
    "Dashboard": Dashboard,
    "DataVerification": DataVerification,
    "DataVisualization": DataVisualization,
    "DebugDashboard": DebugDashboard,
    "Discovery": Discovery,
    "DiscoveryCourse": DiscoveryCourse,
    "DiscoveryProject": DiscoveryProject,
    "Documentation": Documentation,
    "DocumentationADR": DocumentationADR,
    "DocumentationDeveloper": DocumentationDeveloper,
    "EarlyWarningDashboard": EarlyWarningDashboard,
    "EnvironmentDocs": EnvironmentDocs,
    "FratozDashboard": FratozDashboard,
    "Gamification": Gamification,
    "GapsDemonstration": GapsDemonstration,
    "InnAIReview": InnAIReview,
    "LessonView": LessonView,
    "ModuleView": ModuleView,
    "MotivationalAssessment": MotivationalAssessment,
    "NetworkDiagnostic": NetworkDiagnostic,
    "Onboarding": Onboarding,
    "ParentPortal": ParentPortal,
    "Pioneer": Pioneer,
    "PioneerCourse": PioneerCourse,
    "PlatformComparison": PlatformComparison,
    "PlatformStatus": PlatformStatus,
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "PublicRoadmap": PublicRoadmap,
    "ResourceValidation": ResourceValidation,
    "Resources": Resources,
    "ResourcesDashboard": ResourcesDashboard,
    "ResourcesVerification": ResourcesVerification,
    "RoadmapQ1": RoadmapQ1,
    "Schedule": Schedule,
    "SecretsManagement": SecretsManagement,
    "SecurityDocs": SecurityDocs,
    "StrategicPivot": StrategicPivot,
    "Syllabus": Syllabus,
    "SystemHealth": SystemHealth,
    "TeacherCertificationCourse": TeacherCertificationCourse,
    "TeacherCertificationDashboard": TeacherCertificationDashboard,
    "TeacherCertifications": TeacherCertifications,
    "TeacherDashboard": TeacherDashboard,
    "TeacherFeedbackReview": TeacherFeedbackReview,
    "TeacherLessonPage": TeacherLessonPage,
    "TeacherLessonTraining": TeacherLessonTraining,
    "TeacherTraining": TeacherTraining,
    "TechnicalGapsAnalysis": TechnicalGapsAnalysis,
    "TenantDashboard": TenantDashboard,
    "UserManagement": UserManagement,
    "VARKAnalytics": VARKAnalytics,
    "WeekZero": WeekZero,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};