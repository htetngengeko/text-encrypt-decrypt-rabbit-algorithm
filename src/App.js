import CryptoDemo from "./Component/CryptoDemo";
import Decryption from "./Component/Decryption";
import Encryption from "./Component/Encryption";

function App() {
  return (
      <CryptoDemo >
        <Encryption />
        <Decryption />
      </CryptoDemo>
  );
}

export default App;
