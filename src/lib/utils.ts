import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  return timeStr; // Already HH:mm
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\+44\s?)(\d{4})\s?(\d{3})\s?(\d{3})/, '+44 $2 $3 $4');
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
