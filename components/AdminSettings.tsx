import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Lock, Save, Eye, EyeOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import crypto from 'crypto-js';
import {
    getUserByUsername,
    updateUserPassword,
    addPasswordToHistory,
    getPasswordHistory
} from '../utils/supabase/database';

export default function AdminSettings() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingBreach, setIsCheckingBreach] = useState(false);
    const [breachStatus, setBreachStatus] = useState<'safe' | 'breached' | null>(null);
    const [passwordHistoryList, setPasswordHistoryList] = useState<string[]>([]);

    // Load current user and password history
    useEffect(() => {
        const loadUserData = async () => {
            const username = localStorage.getItem('adminUsername') || 'admin';
            const user = await getUserByUsername(username);
            if (user) {
                setCurrentUser(user);
                // Load password history
                const history = await getPasswordHistory(user.id);
                setPasswordHistoryList(history.map(h => h.password_hash));
            }
        };
        loadUserData();
    }, []);

    // Check if password has been used before
    const checkPasswordHistory = (password: string): boolean => {
        const hashedPassword = crypto.SHA256(password).toString();
        return passwordHistoryList.includes(hashedPassword);
    };

    // Check if password is breached using Have I Been Pwned API
    const checkPasswordBreach = async (password: string): Promise<boolean> => {
        try {
            setIsCheckingBreach(true);
            // Hash the password using SHA-1
            const sha1Hash = crypto.SHA1(password).toString().toUpperCase();
            const prefix = sha1Hash.substring(0, 5);
            const suffix = sha1Hash.substring(5);

            // Query Have I Been Pwned API
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            const data = await response.text();

            // Check if our hash suffix appears in the results
            const hashes = data.split('\n');
            const found = hashes.some(line => line.startsWith(suffix));

            setBreachStatus(found ? 'breached' : 'safe');
            return found;
        } catch (error) {
            console.error('Error checking password breach:', error);
            // If API fails, allow password change
            setBreachStatus('safe');
            return false;
        } finally {
            setIsCheckingBreach(false);
        }
    };

    // Check password as user types
    const handleNewPasswordChange = async (value: string) => {
        setNewPassword(value);
        if (value.length >= 6) {
            await checkPasswordBreach(value);
        } else {
            setBreachStatus(null);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        // Check if user is loaded
        if (!currentUser) {
            toast.error('User not found. Please login again.');
            return;
        }

        // Verify current password
        if (currentPassword !== currentUser.password) {
            toast.error('Current password is incorrect');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New password and confirmation do not match');
            return;
        }

        if (currentPassword === newPassword) {
            toast.error('New password must be different from current password');
            return;
        }

        // Check password history
        if (checkPasswordHistory(newPassword)) {
            toast.error('This password has been used before. Please choose a different password.');
            return;
        }

        // Check if password is breached
        const isBreached = await checkPasswordBreach(newPassword);
        if (isBreached) {
            toast.error('This password has been found in data breaches. Please choose a stronger, unique password.');
            return;
        }

        setIsLoading(true);

        try {
            // Hash the new password for history
            const hashedPassword = crypto.SHA256(newPassword).toString();

            // Update password in database
            const updateSuccess = await updateUserPassword(currentUser.id, newPassword);
            if (!updateSuccess) {
                throw new Error('Failed to update password in database');
            }

            // Add to password history
            await addPasswordToHistory(currentUser.id, hashedPassword);

            // Update local storage for current session
            localStorage.setItem('adminPassword', newPassword);

            // Reload password history
            const history = await getPasswordHistory(currentUser.id);
            setPasswordHistoryList(history.map(h => h.password_hash));

            // Update current user state
            setCurrentUser({ ...currentUser, password: newPassword });

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setBreachStatus(null);

            toast.success('Password changed successfully and saved to database!');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your admin password to keep your account secure</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            {/* 3 Column Layout for Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Current Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => handleNewPasswordChange(e.target.value)}
                                            placeholder="Enter new password (min 6 characters)"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Breach Status Indicator */}
                            {newPassword.length >= 6 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-lg flex items-center gap-3 ${isCheckingBreach
                                        ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
                                        : breachStatus === 'breached'
                                            ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                                            : breachStatus === 'safe'
                                                ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                                : ''
                                        }`}
                                >
                                    {isCheckingBreach ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                                Checking password security...
                                            </span>
                                        </>
                                    ) : breachStatus === 'breached' ? (
                                        <>
                                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                                    Password Found in Data Breach!
                                                </p>
                                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                    This password has been exposed in known data breaches. Please choose a different, stronger password.
                                                </p>
                                            </div>
                                        </>
                                    ) : breachStatus === 'safe' ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            <span className="text-sm text-green-700 dark:text-green-300">
                                                Password is secure and not found in any known breaches
                                            </span>
                                        </>
                                    ) : null}
                                </motion.div>
                            )}

                            {/* Password Requirements */}
                            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                <p className="text-sm font-medium">Password Requirements:</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                        At least 6 characters
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${newPassword && newPassword === confirmPassword ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                        Passwords match
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${newPassword && newPassword !== currentPassword ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                        Different from current password
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${newPassword && !checkPasswordHistory(newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                        Not used before in this system
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${breachStatus === 'safe' ? 'bg-green-500' : breachStatus === 'breached' ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                        Not found in data breaches
                                    </li>
                                </ul>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save New Password
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Session Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Session Settings</CardTitle>
                        <CardDescription>Your session will automatically logout after 1 hour of inactivity or when you close the browser tab</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Auto-logout after 1 hour of inactivity
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Session expires when browser tab is closed
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Activity tracking enabled
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
