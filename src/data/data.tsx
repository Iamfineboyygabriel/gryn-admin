import home from "../assets/svg/Home.svg";
import homeActive from "../assets/svg/ActiveHome.svg";
import application from "../assets/svg/Application.svg";
import applicationActive from "../assets/svg/Application.svg";
import payment from "../assets/svg/Payment.svg";
import paymentActive from "../assets/svg/ActivePayments.svg";
import messaging from "../assets/svg/Money.svg";
import messagingActive from "../assets/svg/ActiveMessaging.svg";
import setting from "../assets/svg/Setting.svg";
import settingActive from "../assets/svg/ActiveSetting.svg";
import certificate from "../assets/svg/Cerificate.svg";
import circle from "../assets/svg/WhiteCircle.svg";
import reportAcive from "../assets/svg/InactiveReport.svg";
import report from "../assets/svg/ActiveRepor.svg";
import visaActive from "../assets/svg/activevisa.svg";
import visa from "../assets/svg/inactivevisa.svg";
import activeUser from "../assets/svg/activeUser.svg";
import inActiveUser from "../assets/svg/inActiveUser.svg";
import enquiries from "../assets/svg/enquiries.svg";

export const staffSidebarLinks = [
  {
    img: home,
    imgActive: homeActive,
    text: "Dashboard",
    to: "/staff/dashboard/home",
    pathsToCheck: ["/staff/dashboard/home"],
    feature: "DASHBOARD",
    page: "Overview",
    title: "Dashboard",
  },
  {
    img: application,
    imgActive: applicationActive,
    text: "Application",
    to: "/staff/dashboard/application",
    pathsToCheck: ["/staff/dashboard/application"],
    title: "Application",
  },
  {
    img: visa,
    imgActive: visaActive,
    text: "Visa Application",
    to: "/staff/dashboard/visa",
    pathsToCheck: ["/staff/dashboard/visa"],
    title: "Visa",
  },
  {
    img: payment,
    imgActive: paymentActive,
    text: "Payments",
    to: "/staff/dashboard/payments",
    pathsToCheck: [
      "/staff/dashboard/payments",
      "/staff/dashboard/payments/payment_application",
    ],
    title: "Payment",
  },
  {
    img: reportAcive,
    imgActive: report,
    text: "Report",
    to: "/staff/dashboard/reports",
    pathsToCheck: ["/staff/dashboard/reports"],
    feature: "REPORTS",
    page: "Overview",
    title: "Report",
  },
  {
    img: messaging,
    imgActive: messagingActive,
    text: "Messaging",
    to: "/staff/dashboard/messages",
    pathsToCheck: ["/staff/dashboard/messages"],
    title: "Message",
  },
  {
    img: setting,
    imgActive: settingActive,
    text: "Settings",
    to: "/staff/dashboard/settings",
    pathsToCheck: ["/staff/dashboard/settings"],
    title: "Settings",
  },
];

export const adminSideBarLinks = [
  {
    img: home,
    imgActive: homeActive,
    text: "Dashboard",
    to: "/admin/dashboard/home",
    pathsToCheck: ["/admin/dashboard/home"],
    feature: "DASHBOARD",
    page: "Overview",
    title: "Dashboard",
  },
  {
    img: application,
    imgActive: applicationActive,
    text: "Application",
    to: "/admin/dashboard/application",
    pathsToCheck: ["/admin/dashboard/application"],
    title: "Application",
  },
  {
    img: visa,
    imgActive: visaActive,
    text: "Visa Application",
    to: "/admin/dashboard/visa",
    pathsToCheck: ["/admin/dashboard/visa"],
    title: "Visa",
  },
  {
    img: inActiveUser,
    imgActive: activeUser,
    text: "All Users",
    to: "/admin/dashboard/all_users",
    pathsToCheck: ["/admin/dashboard/all_users"],
  },
  {
    img: inActiveUser,
    imgActive: activeUser,
    text: "All Staffs",
    to: "/admin/dashboard/all_staffs",
    pathsToCheck: ["/admin/dashboard/all_staffs"],
    title: "All Staffs",
  },
  {
    img: payment,
    imgActive: paymentActive,
    text: "Payments",
    to: "/admin/dashboard/payments",
    pathsToCheck: [
      "/admin/dashboard/payments",
      "/admin/dashboard/payments/payment_application",
    ],
    title: "Payments",
  },
  {
    img: enquiries,
    imgActive: enquiries,
    text: "Enquiries",
    to: "/admin/dashboard/enquiries",
    pathsToCheck: ["/admin/dashboard/enquiries", "/admin/dashboard/enquiries"],
    title: "Enquiries",
  },
  {
    img: reportAcive,
    imgActive: report,
    text: "Report",
    to: "/admin/dashboard/reports",
    pathsToCheck: ["/admin/dashboard/reports"],
    feature: "REPORTS",
    page: "Overview",
    title: "Reports",
  },
  {
    img: messaging,
    imgActive: messagingActive,
    text: "Messaging",
    to: "/admin/dashboard/messages",
    pathsToCheck: ["/admin/dashboard/messages"],
    title: "Messaging",
  },
  {
    img: setting,
    imgActive: settingActive,
    text: "Settings",
    to: "/admin/dashboard/settings",
    pathsToCheck: [
      "/admin/dashboard/settings",
      "/admin/dashboard/settings/admin_management",
      "/admin/dashboard/settings/role_management",
    ],
    title: "Settings",
  },
];

export const studentDegree = [
  {
    iconA: certificate,
    iconB: circle,
    titleA: "Bachelor's",
    titleB: "Degree",
    value: "BACHELOR",
  },
  {
    iconA: certificate,
    iconB: circle,
    titleA: "Master's",
    titleB: "Degree",
    value: "MASTERS",
  },
  {
    iconA: certificate,
    iconB: circle,
    titleA: "Doctorial's",
    titleB: "Degree",
    value: "DOCTORATE",
  },
];

export const StaffStats = [
  {
    label: "Total Number of",
    p: "Students",
    figure: "35",
  },
  {
    label: "Total Number of",
    p: "Application",
    figure: "20",
  },
  {
    label: "Number of Completed",
    p: "Applications",
    figure: "15",
  },
  {
    label: "Number of Pending",
    p: "Applications",
    figure: "200,000",
  },
  {
    label: "All",
    p: "Agents",
    figure: "25",
  },
  {
    label: "Conditional",
    p: "Offer",
    figure: "10",
  },
  {
    label: "Unconditional",
    p: "Offer",
    figure: "20",
  },
  {
    label: "Confirmation for",
    p: "Acceptance Studies",
    figure: "5",
  },
];

export enum DocumentType {
  RESUME = "RESUME",
  INTERNATIONAL_PASSPORT = "INTERNATIONAL_PASSPORT",
  OLD_LEVEL = "OLD_LEVEL",
  BACHELOR_DEGREE_CERTIFICATE = "BACHELOR_DEGREE_CERTIFICATE",
  BACHELOR_DEGREE_TRANSCRIPT = "BACHELOR_DEGREE_TRANSCRIPT",
  PERSONAL_STATEMENT = "PERSONAL_STATEMENT",
  REFERENCE_LETTER1 = "REFERENCE_LETTER1",
  REFERENCE_LETTER = "REFERENCE_LETTER1",
  REFERENCE_LETTER2 = "REFERENCE_LETTER2",
  RESEARCH_THESIS = "RESEARCH_THESIS",
  SERVICE_CHARGE = "SERVICE_CHARGE",
  APPLICATION_FEE = "APPLICATION_FEE",
  TUTION_FEE = "TUTION_FEE",
  "PASSPORT" = "PASSPORT",
  "REFLETTER" = "REFLETTER",
  "IDCARD" = "IDCARD",
  "CACDOC" = "CACDOC",
  "OLD_LEVEL_SCRATCH_CARD" = "OLD_LEVEL_SCRATCH_CARD",
  "OND_CERTIFICATE" = "OND_CERTIFICATE",
  "OND_TRANSCRIPT" = "OND_TRANSCRIPT",
  "HND_CERTIFICATE" = "HND_CERTIFICATE",
  "HND_TRANSCRIPT" = "HND_TRANSCRIPT",
  "IHS" = "IHS",
  "VISA_FEE" = "VISA_FEE",
  "OTHER_PAYMENT" = "OTHER_PAYMENT",
  "COMMISSION_RECEIPT" = "COMMISSION_RECEIPT",
}

export const signUp = [
  {
    path: "/admin_login",
    text: "Sign in as Admin",
  },
  {
    path: "/staff_login",
    text: "Sign in as Staff",
  },
];
