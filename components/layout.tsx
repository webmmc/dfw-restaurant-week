import Alert from "./alert";
import Footer from "./footer";
import Header from "./header";
import Meta from "./meta";

export default function Layout({
  mainMenu,
  footerMenu,
  socialMenu,
  preview,
  children,
}) {
  return (
    <>
      <Meta />

      <Header
        mainMenu={mainMenu}
        socialMenu={socialMenu}
        rwLogo="https://www.dfwrestaurantportal.com/wp-content/uploads/2023/04/logo.png"
        audacyIcon="https://www.dfwrestaurantportal.com/wp-content/uploads/2023/04/audacy-logo-1.png"
      />

      <div className="rw-site min-h-screen bg-white relative z-1">
        <div className="rwdfw">{children}</div>
      </div>

      <Footer footerMenu={footerMenu} />
    </>
  );
}
