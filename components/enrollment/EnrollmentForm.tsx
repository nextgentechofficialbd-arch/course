
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, CheckCircle, Tag, Loader2, Phone, Mail, User } from 'lucide-react';

const enrollmentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Enter a valid BD phone number (e.g. 01700000000)"),
  paymentMethod: z.enum(['bkash', 'nagad']),
  transactionId: z.string().min(5, "Transaction ID must be at least 5 characters"),
  screenshot: z.any().refine((files) => files?.length > 0, "Payment screenshot is required"),
});

type EnrollmentData = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  courseId: string;
  basePrice: number;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ courseId, basePrice }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EnrollmentData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { paymentMethod: 'bkash' }
  });

  const finalPrice = basePrice - (basePrice * (discount / 100));

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsValidatingPromo(true);
    try {
      const res = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, course_id: courseId })
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount_percent);
      } else {
        alert(data.message || "Invalid promo code");
        setDiscount(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const onSubmit = async (data: EnrollmentData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'screenshot') {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value as string);
        }
      });
      formData.append('courseId', courseId);
      formData.append('promoCode', promoCode);
      formData.append('finalPrice', finalPrice.toString());

      const res = await fetch('/api/enroll', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to submit enrollment");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-black mb-2 dark:text-white">Enrollment Submitted!</h4>
        <p className="text-slate-500 text-sm">We'll verify your payment and grant access within 24 hours. Check your email for updates.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            {...register('fullName')}
            placeholder="Your Full Name" 
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary transition-all text-sm"
          />
          {errors.fullName && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.fullName.message}</p>}
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            {...register('email')}
            type="email"
            placeholder="Email Address" 
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary transition-all text-sm"
          />
          {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            {...register('phone')}
            placeholder="Phone Number (01xxxxxxxxx)" 
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary transition-all text-sm"
          />
          {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo Code" 
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-primary transition-all text-sm uppercase font-bold tracking-widest"
          />
        </div>
        <button 
          type="button"
          onClick={handleApplyPromo}
          disabled={isValidatingPromo || !promoCode}
          className="bg-slate-900 dark:bg-slate-700 text-white px-4 py-3 rounded-xl text-xs font-black hover:bg-black transition-all disabled:opacity-50"
        >
          {isValidatingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Payment</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" {...register('paymentMethod')} value="bkash" className="accent-primary" />
              <span className="text-xs font-bold uppercase">bKash</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" {...register('paymentMethod')} value="nagad" className="accent-primary" />
              <span className="text-xs font-bold uppercase">Nagad</span>
            </label>
          </div>
        </div>
        
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-6">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Send Payment To</p>
          <p className="text-lg font-black text-slate-900 dark:text-white">01700 000 000</p>
          <p className="text-[10px] text-slate-500 mt-1">Send Money (Personal) the exact amount below.</p>
        </div>

        <div className="space-y-4">
          <input 
            {...register('transactionId')}
            placeholder="Enter Transaction ID" 
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm font-mono"
          />
          {errors.transactionId && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.transactionId.message}</p>}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Upload Proof (Max 5MB)</label>
            <input 
              type="file"
              {...register('screenshot')}
              accept="image/*"
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-primary file:text-white hover:file:bg-primary/90"
            />
            {errors.screenshot && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.screenshot.message as string}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-slate-500">Total Payable</span>
          <div className="text-right">
            {discount > 0 && <span className="text-xs text-slate-400 line-through mr-2">৳{basePrice}</span>}
            <span className="text-2xl font-black text-primary">৳{finalPrice}</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Enrollment'}
        </button>
      </div>
    </form>
  );
};

export default EnrollmentForm;
