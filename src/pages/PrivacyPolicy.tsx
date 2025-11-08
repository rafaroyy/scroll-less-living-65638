
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <h1 className="text-4xl font-bold text-brand-dark mb-8 font-poppins">Privacy Policy – Social Limits</h1>
            
            <div className="text-sm text-gray-600 mb-8">
              <p><em>Last updated:</em> 27 July 2025</p>
            </div>

            <div className="space-y-6 text-gray-700">
              <p>
                Thank you for choosing to be part of the Social Limits community ("Company", "we", "us" or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, how we store and protect it, and what rights you have in relation to it. It is designed to meet the disclosure requirements of the Google Play Developer Program Policy, including the Health Apps and User Data sections.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p className="font-semibold text-blue-800">Important — Wellness Only</p>
                <p className="text-blue-700">Social Limits is not a medical device and does not provide medical or clinical advice. The Services are intended solely for general wellness and habit‑formation purposes.</p>
              </div>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">1. Definitions</h2>
                <p className="mb-4">For the purposes of this Privacy Policy:</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Term</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Application / Service</td>
                        <td className="border border-gray-300 px-4 py-2">The Social Limits mobile application, website and any associated services.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Health & Fitness Data</td>
                        <td className="border border-gray-300 px-4 py-2">Personal and sensitive data related to your physical activity (e.g. step count, distance walked, active minutes, activity recognition) that our app accesses through Google Fit, Health Connect, Apple Health, device motion & fitness sensors, or on‑device APIs.</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Personal Data</td>
                        <td className="border border-gray-300 px-4 py-2">Any information that relates to an identified or identifiable individual, including Health & Fitness Data.</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Processing</td>
                        <td className="border border-gray-300 px-4 py-2">Any operation performed on Personal Data such as collection, storage, use, sharing, or deletion.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">2. What Data We Collect</h2>
                
                <h3 className="text-lg font-medium text-brand-dark mt-6 mb-3">2.1 Account & Contact Data</h3>
                <ul className="space-y-1 list-disc ml-6 mb-4">
                  <li>Email address</li>
                  <li>First and last name</li>
                  <li>Password or authentication token</li>
                </ul>

                <h3 className="text-lg font-medium text-brand-dark mt-6 mb-3">2.2 Usage Data</h3>
                <p className="mb-4">
                  Automatically collected technical data about how you interact with the Service (e.g. IP address, device model, OS version, time stamps, in‑app events).
                </p>

                <h3 className="text-lg font-medium text-brand-dark mt-6 mb-3">2.3 Health & Fitness Data</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Data type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Source</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Step count & distance</td>
                        <td className="border border-gray-300 px-4 py-2">Google Fit / Health Connect / Apple Health or phone motion sensors</td>
                        <td className="border border-gray-300 px-4 py-2">Core feature — unlocks social apps once your daily goal is reached</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Activity state (walking, running, idle)</td>
                        <td className="border border-gray-300 px-4 py-2">On‑device Activity Recognition API</td>
                        <td className="border border-gray-300 px-4 py-2">Gamification (leaderboard, streaks) & accurate goal tracking</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 italic">We do not collect heart‑rate, location routes, medical conditions, or any other sensitive health data.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">3. How We Use Your Data</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Lawful basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Provide and maintain the Service (e.g. determine when social media blocking is lifted)</td>
                        <td className="border border-gray-300 px-4 py-2">Performance of contract – providing the features you requested</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Analytics & product improvement (aggregate, de‑identified metrics only)</td>
                        <td className="border border-gray-300 px-4 py-2">Legitimate interests – improving app reliability & user experience</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Send service‑related communications (e.g. goal reminders, policy updates)</td>
                        <td className="border border-gray-300 px-4 py-2">Legitimate interests / Consent</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Legal compliance & security (fraud prevention, dispute resolution)</td>
                        <td className="border border-gray-300 px-4 py-2">Legal obligation / Legitimate interests</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm bg-yellow-50 border border-yellow-200 rounded p-3">
                  <strong>Health & Fitness Data is never used for advertising, marketing, credit scoring, or sold to third parties.</strong> We do not combine it with other data to infer sensitive attributes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">4. Sharing & Disclosure</h2>
                
                <p className="mb-4">We share Personal Data only in the following situations:</p>
                <ul className="space-y-2 list-disc ml-6 mb-4">
                  <li><strong>Service providers</strong> – cloud hosting, analytics, crash reporting. They act under written agreements that require confidentiality and security.</li>
                  <li><strong>Platform integrations</strong> – when you connect Google Fit, Health Connect, or Apple Health, activity data flows between your device and those platforms on your instruction. We do not receive other data stored in those services.</li>
                  <li><strong>Legal obligations</strong> – to comply with court orders or lawful requests.</li>
                  <li><strong>Business transfers</strong> – in the event of a merger or acquisition (with notice to you).</li>
                </ul>
                
                <p className="text-sm bg-red-50 border border-red-200 rounded p-3">
                  <strong>We do not share Health & Fitness Data with advertising networks, data brokers, or other unrelated third parties.</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">5. Retention</h2>
                
                <ul className="space-y-3 list-disc ml-6 mb-4">
                  <li><strong>Account & Contact Data:</strong> kept while your account is active plus 12 months, then deleted or irreversibly anonymised.</li>
                  <li><strong>Health & Fitness Data:</strong> stored locally on your device and retained on our servers only as long as necessary to compute goal completion (maximum 30 days), after which it is aggregated or deleted.</li>
                  <li><strong>Usage Data:</strong> retained for 24 months for security and analytics, then aggregated.</li>
                </ul>
                
                <p className="mb-4">
                  You can delete your account at any time from the in‑app settings or by emailing <a href="mailto:privacy@social-limits.com" className="text-brand-primary hover:underline">privacy@social-limits.com</a>. Deletion triggers irreversible erasure of associated Personal Data within 30 days unless retention is required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">6. Security</h2>
                
                <p className="mb-4">We apply industry‑standard safeguards to protect Personal Data:</p>
                <ul className="space-y-2 list-disc ml-6 mb-4">
                  <li>Encryption in transit (TLS 1.2+) and encryption at rest (AES‑256).</li>
                  <li>Strict access controls, least‑privilege policies, and multi‑factor authentication for employees.</li>
                  <li>Regular security audits and vulnerability scanning.</li>
                </ul>
                
                <p className="text-sm text-gray-600 italic">
                  Despite our efforts, no internet transmission or storage system can be 100% secure. We therefore cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">7. Your Rights & Choices</h2>
                
                <p className="mb-4">Depending on your jurisdiction, you may have rights to:</p>
                <ul className="space-y-2 list-disc ml-6 mb-4">
                  <li>Access the personal information we hold about you.</li>
                  <li>Rectify inaccurate or incomplete data.</li>
                  <li>Delete your data ("right to be forgotten").</li>
                  <li>Object / restrict certain processing.</li>
                  <li>Data portability.</li>
                  <li>Withdraw consent at any time (this does not affect processing carried out before withdrawal).</li>
                </ul>
                
                <p>
                  Requests can be made via the in‑app settings or by emailing <a href="mailto:privacy@social-limits.com" className="text-brand-primary hover:underline">privacy@social-limits.com</a>. We respond within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">8. Children's Privacy</h2>
                <p>
                  The Service is not directed to children under 13. We do not knowingly collect data from children. If we become aware that we have inadvertently collected such information, we will delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">9. International Transfers</h2>
                <p>
                  We may process data on servers located outside your country. When we do so, we rely on standard contractual clauses or equivalent legal mechanisms to ensure adequate protection.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">10. Changes to This Policy</h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date and will be effective as soon as it is accessible. We will notify you of material changes via email or an in‑app notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">11. Contact Us</h2>
                <p className="mb-4">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:sociallimitsb@gmail.com" className="text-brand-primary hover:underline">sociallimitsb@gmail.com</a>
                </p>
              </section>

              <section className="border-t-2 border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">Health Connect & Platform Disclosure (Android‑specific)</h2>
                <p className="mb-4">
                  When you connect Social Limits to Google Fit or Health Connect, Android will present a permissions dialog describing the exact data types (e.g. Steps, Distance) that the app requests. Granting permission allows Social Limits to read those data types solely to enable the core feature of unlocking social media once your daily step goal is achieved. Social Limits does not write data back to Google Fit/Health Connect and does not share the retrieved data with third parties. You can revoke access at any time in Android → Settings → Security & privacy → Health Connect.
                </p>
              </section>

              <section className="border-t-2 border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-brand-dark mb-4 font-poppins">Data Safety Summary (Google Play Console)</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Data Type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Collected?</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Shared?</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Required for app to function?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Step count & distance (Health & Fitness)</td>
                        <td className="border border-gray-300 px-4 py-2">Yes</td>
                        <td className="border border-gray-300 px-4 py-2">No</td>
                        <td className="border border-gray-300 px-4 py-2">Core functionality (unlock)</td>
                        <td className="border border-gray-300 px-4 py-2">Yes</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Activity recognition</td>
                        <td className="border border-gray-300 px-4 py-2">Yes</td>
                        <td className="border border-gray-300 px-4 py-2">No</td>
                        <td className="border border-gray-300 px-4 py-2">Goal tracking & analytics</td>
                        <td className="border border-gray-300 px-4 py-2">Yes</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Email, name</td>
                        <td className="border border-gray-300 px-4 py-2">Yes</td>
                        <td className="border border-gray-300 px-4 py-2">Yes (auth & messaging provider)</td>
                        <td className="border border-gray-300 px-4 py-2">Account creation, communication</td>
                        <td className="border border-gray-300 px-4 py-2">Yes</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">Usage diagnostics</td>
                        <td className="border border-gray-300 px-4 py-2">Yes</td>
                        <td className="border border-gray-300 px-4 py-2">No</td>
                        <td className="border border-gray-300 px-4 py-2">Analytics, crash detection</td>
                        <td className="border border-gray-300 px-4 py-2">No (opt‑out)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-gray-600 italic">
                  This table is provided for transparency; the authoritative source is the Data Safety form in the Play Console.
                </p>
              </section>

              <div className="text-center text-sm text-gray-500 border-t pt-6 mt-8">
                <p>© 2025 Social Limits Pty Ltd. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
