// import AppProvidersWrapper from "@/components/wrappers/AppProvidersWrapper";
// import { Provider } from "react-redux";
// import { store } from "@/store/store";
// import { Toaster } from "react-hot-toast";
// import { DEFAULT_PAGE_TITLE } from "@/context/constants";
// import type { Metadata } from "next";

// import "flatpickr/dist/flatpickr.min.css";
// import "@/assets/scss/app.scss";

// export const metadata: Metadata = {
//   title: {
//     template: "Heavan Holiday | CRM",
//     default: DEFAULT_PAGE_TITLE,
//   },
//   description:
//     "A fully featured admin theme which can be used to build CRM, CMS, etc.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={``}>
//         <Provider store={store}>
//           <AppProvidersWrapper>
//             {children}
//             <Toaster position="top-right" />
//           </AppProvidersWrapper>
//         </Provider>
//       </body>
//     </html>
//   );
// }

import AppProvidersWrapper from "@/components/wrappers/AppProvidersWrapper";
import { DEFAULT_PAGE_TITLE } from "@/context/constants";
import type { Metadata } from "next";

import "flatpickr/dist/flatpickr.min.css";
import "@/assets/scss/app.scss";

export const metadata: Metadata = {
  title: {
    template: "Heavan Holiday | CRM",
    default: DEFAULT_PAGE_TITLE,
  },
  description:
    "A fully featured admin theme which can be used to build CRM, CMS, etc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvidersWrapper>
          {children}
        </AppProvidersWrapper>
      </body>
    </html>
  );
}
