const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const handler = async (request: Request) => {
  try {
    const { email, password, submenu } = await request.json();

    const emailContent = `
      <p>Good day! </p>

      <p>Your account has been created successfully.</p>
    
      <strong>Account Details:</strong><br>
      <strong>Email:</strong> ${email}<br>
      <strong>Password:</strong> ${password}<br>
      <strong>Assigned to:</strong> ${submenu}
    
      <p><strong>IMPORTANT REMINDER:</strong> You are required to change your password immediately upon first login for security purposes.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Microsite <team@email.alexgalicio.dev>",
        to: email,
        subject: "Your Account Has Been Created - Login Credentials",
        html: emailContent,
      }),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
Deno.serve(handler);
