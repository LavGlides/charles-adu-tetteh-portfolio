// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for your portfolio
export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: "click",
    category: "Button",
    label: `${buttonName} - ${location}`,
  });
};

export const trackFormSubmission = (formType: string, success: boolean) => {
  event({
    action: success ? "form_submit_success" : "form_submit_error",
    category: "Form",
    label: formType,
  });
};

export const trackProjectView = (projectName: string) => {
  event({
    action: "view_project",
    category: "Project",
    label: projectName,
  });
};

export const trackSocialClick = (platform: string) => {
  event({
    action: "social_click",
    category: "Social",
    label: platform,
  });
};

export const trackDownload = (fileName: string) => {
  event({
    action: "download",
    category: "File",
    label: fileName,
  });
};

export const trackTimeOnPage = (timeSpent: number, page: string) => {
  event({
    action: "time_on_page",
    category: "Engagement",
    label: page,
    value: timeSpent,
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
