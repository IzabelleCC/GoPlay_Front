export default {
    expo: {
        name: "GoPlay",
        slug: "goplay",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.goplay.app",
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
            permissions: [
                "READ_MEDIA_IMAGES",
                "READ_EXTERNAL_STORAGE"
            ]
        },
        web: {
            favicon: "./assets/favicon.png",
            build: {
                devtool: "source-map"
            }
        },
        plugins: [
            "expo-font",
            "@react-native-firebase/app"
        ],
        assetBundlePatterns: ["**/*"],
        extra: {
            eas: {
                projectId: "a009997f-1ac6-4653-a3c9-6101b5139910"
            }
        },
        owner: "izabellecunha",
        "newArchEnabled": true
    }
};
