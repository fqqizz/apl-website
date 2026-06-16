import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FaqPage from "@/pages/FaqPage";
import FoundingFranchisesPage from "@/pages/FoundingFranchisesPage";
import FoundingPlayersPage from "@/pages/FoundingPlayersPage";
import FranchisesPage from "@/pages/FranchisesPage";
import PartnersPage from "@/pages/PartnersPage";
import PaymentCallbackPage from "@/pages/PaymentCallbackPage";
import PrivacyRedirectPage from "@/pages/PrivacyRedirectPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import RegisterFranchisePage from "@/pages/RegisterFranchisePage";
import RegisterPlayerPage from "@/pages/RegisterPlayerPage";
import StatusPage from "@/pages/StatusPage";
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage";
import TermsRedirectPage from "@/pages/TermsRedirectPage";
import VisionPage from "@/pages/VisionPage";
import NotFoundPage from "@/pages/NotFoundPage";

import AdminLoginPage from "@/pages/admin/LoginPage";
import AdminDashboardPage from "@/pages/admin/protected/DashboardPage";
import AdminPlayersPage from "@/pages/admin/protected/PlayersPage";
import AdminFranchisesPage from "@/pages/admin/protected/FranchisesPage";
import AdminPaymentsPage from "@/pages/admin/protected/PaymentsPage";
import AdminContactPage from "@/pages/admin/protected/ContactPage";
import AdminAnnouncementsPage from "@/pages/admin/protected/AnnouncementsPage";

import SiteLayout from "@/components/layout/SiteLayout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/founding-franchises" component={FoundingFranchisesPage} />
      <Route path="/founding-players" component={FoundingPlayersPage} />
      <Route path="/franchises" component={FranchisesPage} />
      <Route path="/partners" component={PartnersPage} />
      <Route path="/payment-callback" component={PaymentCallbackPage} />
      <Route path="/privacy" component={PrivacyRedirectPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/refund-policy" component={RefundPolicyPage} />
      <Route path="/register/franchise" component={RegisterFranchisePage} />
      <Route path="/register/player" component={RegisterPlayerPage} />
      <Route path="/status" component={StatusPage} />
      <Route path="/terms-and-conditions" component={TermsAndConditionsPage} />
      <Route path="/terms" component={TermsRedirectPage} />
      <Route path="/vision" component={VisionPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/players" component={AdminPlayersPage} />
      <Route path="/admin/franchises" component={AdminFranchisesPage} />
      <Route path="/admin/payments" component={AdminPaymentsPage} />
      <Route path="/admin/contact" component={AdminContactPage} />
      <Route path="/admin/announcements" component={AdminAnnouncementsPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <SiteLayout>
          <Router />
        </SiteLayout>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
