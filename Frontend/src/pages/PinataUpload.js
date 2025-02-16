import axios from "axios";

// const PINATA_API_KEY = "d0b6f6d2a44acded0a6f";
// const PINATA_SECRET_API_KEY = "c2d78fe6f4a0e844b5c1a5aa45c060c743e2a32d45a0955770e656cd27c12c0a";

export const uploadToPinata = async (file) => {
    console.log(file)

    if (!file) {
        alert("Please select a file first.");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
  
      const metadata = JSON.stringify({ name: file.name });
      formData.append("pinataMetadata", metadata);
  
      const options = JSON.stringify({ cidVersion: 0 });
      formData.append("pinataOptions", options);
  
      try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "d0b6f6d2a44acded0a6f",
            pinata_secret_api_key: "c2d78fe6f4a0e844b5c1a5aa45c060c743e2a32d45a0955770e656cd27c12c0a",
          },
        });
        
        return response.data.IpfsHash;
        console.log(response.data.IpfsHash)
      } catch (err) {
        console.log(err)
        // setError("Upload failed. Check your API keys and try again.");
      } finally {
        // setLoading(false);
      }
};
