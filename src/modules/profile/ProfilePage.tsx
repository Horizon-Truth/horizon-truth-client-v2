import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/shared/components/ui/form';
import {
    ShieldCheck,
    Mail,
    User as UserIcon,
    Calendar,
    Edit2,
    X,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Lock,
    Globe
} from 'lucide-react';
import { AnonymizeConfirmModal } from '@/shared/components/modals/AnonymizeConfirmModal';