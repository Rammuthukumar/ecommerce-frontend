# Authentication Pages Integration Guide

## Files Included
1. **Login.jsx** - Login page component
2. **Register.jsx** - Registration/Signup page component
3. **OTPVerify.jsx** - OTP verification page component
4. **App-routing-example.jsx** - Example of how to set up routing

## Installation Steps

### 1. Copy Components
Copy the three authentication components to your `src/components/` folder:
```
src/
  components/
    Login.jsx
    Register.jsx
    OTPVerify.jsx
```

### 2. Install React Router (if not already installed)
```bash
npm install react-router-dom
```

### 3. Update Your App.jsx
Add the routes for the new pages. See `App-routing-example.jsx` for reference:

```jsx
import Login from './components/Login';
import Register from './components/Register';
import OTPVerify from './components/OTPVerify';

// Inside your Routes component:
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/otp-verify" element={<OTPVerify />} />
```

### 4. Update Your Navbar Component
Add a link to the login page in your Navbar.jsx:

```jsx
import { Link, useNavigate } from 'react-router-dom';

// In your navbar:
<Link to="/login">Login</Link>
```

## Features Included

### Login Page
- Email and password inputs
- Remember me checkbox
- Forgot password link
- Form validation
- Redirects to OTP verification after login
- Link to registration page

### Register Page
- First name and last name inputs
- Email validation (regex)
- Phone number validation (10 digits)
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Confirm password matching
- Terms & conditions checkbox
- Real-time error messages
- Redirects to OTP verification after registration

### OTP Verification Page
- 6-digit OTP input with auto-focus
- Auto-advance to next input
- Paste support for OTP
- 2-minute countdown timer
- Resend OTP functionality
- Success/error messages
- Redirects to home page after successful verification

## Customization

### Styling
All components use inline styles for easy customization. To modify colors, spacing, or other styles, simply edit the `styles` object in each component.

### API Integration
To connect these components to your backend API:

1. **Login.jsx** - Update the `handleSubmit` function:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('YOUR_API_ENDPOINT/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store token, update state, etc.
      navigate('/otp-verify');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

2. **Register.jsx** - Update the `handleSubmit` function similarly

3. **OTPVerify.jsx** - Update the `handleSubmit` function to verify OTP with your backend

### Phone Number Format
The OTP page displays a masked phone number. Update this in OTPVerify.jsx:
```jsx
<p style={styles.phoneNumber}>+91 ********78</p>
// Change to:
<p style={styles.phoneNumber}>{maskedPhone}</p>
// Where maskedPhone comes from your state/props
```

## Navigation Flow
1. User lands on Login page
2. Can click "Sign up" to go to Register page
3. After login/register, navigates to OTP Verification
4. After successful OTP verification, navigates to Home page

## Additional Features to Implement
- Protected routes (require authentication)
- Session management
- Token storage (localStorage/cookies)
- Password reset flow
- Social login (Google, Facebook, etc.)
- Email verification

## Troubleshooting

**Issue: Routes not working**
- Make sure you have `react-router-dom` installed
- Ensure your App.jsx is wrapped with `<Router>` or `<BrowserRouter>`

**Issue: Navigation not working**
- Import `useNavigate` from 'react-router-dom'
- Make sure components are inside the Router context

**Issue: Styling looks different**
- The components use inline styles, so no CSS file is needed
- If you want to use CSS classes instead, extract the styles to a CSS file

## Support
For questions or issues, please refer to:
- React Router documentation: https://reactrouter.com/
- React documentation: https://react.dev/
