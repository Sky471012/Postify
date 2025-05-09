const getAccessToken = async (code) => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    redirect_uri: "http://localhost:5000/api/linkedin/callback",
  });

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data)); // better error info
  }

  return data;
};

const getUserData = async (accessToken) => {
    const response =await fetch ('https://api.linkedin.com/v2/userinfo', {
         method:'get',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        throw new Error(response.statusText); // better error info
    }

    const userData = await response.json()
    return userData;
    }

const linkedinCallback = async (req, res) => {
  try {
    const { code } = req.query; // ✅ fixed typo
    if (!code) throw new Error("Missing authorization code");

    const accessToken = await getAccessToken(code);

    const userData = await getUserData(accessToken.access_token);

    res.status(200).json({ userData });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Unknown error",
    });
  }
};

module.exports = linkedinCallback;
