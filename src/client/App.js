import { state } from "./state.js";
import { DetailScreen, FavoriteScreen, HomeScreen } from "./screens/index.js";

export default function App() {
    const homeScreen = HomeScreen();
    const favoriteScreen = FavoriteScreen();
    const detailScreen = DetailScreen();

    if (state.path === '/favorite') {
        return favoriteScreen;
    } else if (state.path === '/home') {
        return homeScreen;
    } else if (state.path === '/contact-detail') {
        return detailScreen;
    } else {
        return homeScreen;
    }
}