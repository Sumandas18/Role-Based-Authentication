module.exports = ({ name, otp }) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial; background:#020617; color:#e5e7eb; }
        .box { max-width:520px; margin:auto; background:#020617; padding:25px; border-radius:10px }
        .otp { font-size:28px; letter-spacing:6px; color:#f97316; text-align:center; margin:20px 0 }
    </style>
</head>
<body>
    <div class="box">
        <h2>OTP Resent</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your new OTP is:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for 5 minutes.</p>
    </div>
</body>
</html>
`;