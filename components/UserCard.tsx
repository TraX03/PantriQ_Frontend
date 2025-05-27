import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { User } from "@/utility/fetchPosts";
import { styles as profileStyles } from "@/utility/profile/styles";
import { Image, Text, View } from "react-native";
import styles from "./styles";

type Props = {
  user: User;
};

export default function UserCard({ user }: Props) {
  return (
    <View style={styles.userCardContainer}>
      <View className="flex-row items-center flex-1">
        <View
          style={[
            profileStyles.avatarContainer,
            { width: 60, height: 60, marginRight: 20, elevation: 4 },
          ]}
        >
          <Image
            source={{ uri: user.profilePic }}
            style={profileStyles.avatar}
            resizeMode="cover"
          />
        </View>
        <View className="flex-shrink">
          <Text style={styles.usernameText}>{user.name}</Text>
          <Text style={styles.bioText} numberOfLines={1} ellipsizeMode="tail">
            {user.bio}
          </Text>
        </View>
      </View>

      <IconSymbol name="chevron.right" color={Colors.ui.overlay} size={20} />
    </View>
  );
}
