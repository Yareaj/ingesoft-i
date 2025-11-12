import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../config/commonStyles';
import { theme } from '../config/designSystem';
import { GRButton } from '../components/GRButton';

interface ProfileScreenProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

export default function ProfileScreen({
  userName = 'Runner',
  userEmail = 'runner@ghostrunning.com',
  userImage,
}: ProfileScreenProps) {
  return (
    <SafeAreaView style={commonStyles.container} edges={['top', 'bottom']}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerText}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Image and Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.placeholderText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Trainings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0 km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0h</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <GRButton label="✏️ Edit Profile" variant="secondary" style={styles.actionButtonSpacing} />
          <GRButton label="⚙️ Settings" variant="secondary" style={styles.actionButtonSpacing} />
          <GRButton label="🚪 Logout" variant="primary" style={styles.actionButtonSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 1.5,
    paddingHorizontal: theme.spacing.xl,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    padding: 3,
    marginBottom: theme.spacing.l,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: theme.colors.textPrimary,
    fontSize: 48,
    fontWeight: '700',
  },
  userName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.xxl,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.m,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
    marginHorizontal: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.l,
    marginBottom: theme.spacing.l,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.xxl,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.s,
  },
  actionsSection: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
  },
  actionButtonSpacing: {
    marginBottom: theme.spacing.s,
  },
});
