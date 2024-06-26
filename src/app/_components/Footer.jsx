import { sourceCodePro } from "../_styles/fonts";

const Footer = () => {
  return (
    <footer
      className={`p-4 bg-gray-800 text-white w-full grid grid-cols-3 fixed bottom-0 ${sourceCodePro.className}`}
    >
      <p className={`text-center ${sourceCodePro.className}`}>
        Taught by Shawn Esquivel
      </p>
      <p className={`text-center ${sourceCodePro.className}`}>
        &copy; Weeknights and Weekends 2024
      </p>
      <p className={`text-center ${sourceCodePro.className}`}>
        Questions? Join the Discord
      </p>
    </footer>
  );
};

export default Footer;
