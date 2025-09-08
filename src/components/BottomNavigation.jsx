import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { TbShoppingCart } from "react-icons/tb";
import { TbHeart } from "react-icons/tb";
import { TbUser } from "react-icons/tb";
import { IoMdHome } from "react-icons/io";
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function SimpleBottomNavigation() {
  const { t, i18n } = useTranslation("translation");
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  React.useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0, background: "#fff", zIndex: 9 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label={`${i18n.language === "ar" ? "الرئيسية" : "Home"}`} value="/" component={Link} to="/" icon={<IoMdHome size={20} />} />
        <BottomNavigationAction label={`${i18n.language === "ar" ? "السلة" : "Cart"}`} value="/cart/42524" component={Link} to="/cart/42524" icon={<TbShoppingCart size={20} />} />
        <BottomNavigationAction label={`${i18n.language === "ar" ? "المفضلة" : "Favorites"}`} value="/wishlist/32525424" component={Link} to="/wishlist/32525424" icon={<TbHeart size={20} />} />
        <BottomNavigationAction label={`${i18n.language === "ar" ? "الحساب" : "Profile"}`} value="/member/42525425" component={Link} to="/member/42525425" icon={<TbUser size={20} />} />
      </BottomNavigation>
    </Box>
  );
}
