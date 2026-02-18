
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Send, 
  Tag, 
  Loader2, 
  Phone, 
  Mail, 
  User, 
  CheckCircle, 
  CreditCard, 
  UploadCloud,
  MessageCircle,
  X
} from 'lucide-react';
import { PAYMENT } from '@/lib/constants';

const enrollmentSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Enter valid BD phone number (e.g. 01712345678)'),
  payment_method: z.enum(['bkash', 'nagad']),
  transaction_id: z.string().min(4, 'Enter valid transaction ID'),
  payment_number: z.string().min(10, 'Enter the number you paid from'),
  screenshot: z.any()
    .refine((files) => files && files.length > 0, 'Payment screenshot is required')
    .refine((files) => files && files[0]?.size < 5000000, 'Max file size is 5MB')
});

type EnrollmentData = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  courseId: string;
  basePrice: number;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ courseId, basePrice }) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EnrollmentData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      payment_method: 'bkash'
    }
  });

  const selectedPaymentMethod = watch('payment_method');
  const finalPrice = Math.floor(basePrice - (basePrice * (discountPercent / 100)));

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsValidatingPromo(true);
    setPromoError(null);
    try {
      const res = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, course_id: courseId })
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountPercent(data.discount_percent);
      } else {
        setPromoError(data.message || 'Invalid code');
        setDiscountPercent(0);
      }
    } catch (err) {
      setPromoError('Network error. Try again.');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EnrollmentData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('payment_method', data.payment_method);
      formData.append('transaction_id', data.transaction_id);
      formData.append('payment_number', data.payment_number);
      formData.append('screenshot', data.screenshot[0]);
      formData.append('course_id', courseId);
      formData.append('promo_code', promoCode);
      formData.append('amount_paid', finalPrice.toString());

      const res = await fetch('/api/enroll', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const errData = await res.json();
        alert(errData.message || "Enrollment failed. Please try again.");
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h4 className="text-2xl font-black mb-4 text-foreground">Enrollment Received!</h4>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          We've received your payment details. Our team will verify the transaction and grant access within 24 hours. Check your email for confirmation.
        </p>
        <a 
          href={`https://wa.me/${PAYMENT.BKASH}?text=Hello, I just enrolled in a course with Email: ${watch('email')}`}
          target="_blank"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-600/20"
        >
          <MessageCircle size={20} />
          Chat with Support
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Info */}
      <div className="space-y-4">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            {...register('full_name')}
            placeholder="Full Name" 
            className={`w-full bg-muted/30 border ${errors.full_name ? 'border-destructive' : 'border-border'} rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium`}
          />
          {errors.full_name && <p className="text-[10px] text-destructive mt-1.5 ml-1 font-bold uppercase tracking-widest">{errors.full_name.message}</p>}
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            {...register('email')}
            type="email"
            placeholder="Email Address" 
            className={`w-full bg-muted/30 border ${errors.email ? 'border-destructive' : 'border-border'} rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium`}
          />
          {errors.email && <p className="text-[10px] text-destructive mt-1.5 ml-1 font-bold uppercase tracking-widest">{errors.email.message}</p>}
        </div>

        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            {...register('phone')}
            placeholder="Mobile Number" 
            className={`w-full bg-muted/30 border ${errors.phone ? 'border-destructive' : 'border-border'} rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all text-sm font-medium`}
          />
          {errors.phone && <p className="text-[10px] text-destructive mt-1.5 ml-1 font-bold uppercase tracking-widest">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Promo Section */}
      <div className="pt-4 border-t border-border">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block ml-1">Have a promo code?</label>
        <div className="flex gap-3">
          <div className="relative flex-grow group">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE" 
              className="w-full bg-muted/30 border border-border rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all text-xs font-black tracking-widest"
            />
          </div>
          {discountPercent > 0 ? (
            <button 
              type="button" 
              onClick={() => { setDiscountPercent(0); setPromoCode(''); }}
              className="bg-destructive/10 text-destructive p-3 rounded-2xl hover:bg-destructive hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleApplyPromo}
              disabled={isValidatingPromo || !promoCode}
              className="bg-foreground text-background px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30"
            >
              {isValidatingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </button>
          )}
        </div>
        {promoError && <p className="text-[10px] text-destructive mt-2 ml-1 font-bold uppercase">{promoError}</p>}
        {discountPercent > 0 && <p className="text-[10px] text-green-500 mt-2 ml-1 font-black uppercase tracking-widest">{discountPercent}% Discount Applied! 🎉</p>}
      </div>

      {/* Payment Section */}
      <div className="bg-muted/30 p-8 rounded-[2rem] border border-border space-y-6">
        <div className="text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Send Payment of</p>
          <p className="text-4xl font-black text-primary">৳{finalPrice.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedPaymentMethod === 'bkash' ? 'bg-primary/10 border-primary' : 'bg-background border-border hover:border-muted-foreground'}`}>
            <input type="radio" {...register('payment_method')} value="bkash" className="hidden" />
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">bKash</span>
            <span className="text-xs font-bold text-foreground">{PAYMENT.BKASH}</span>
          </label>
          <label className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedPaymentMethod === 'nagad' ? 'bg-primary/10 border-primary' : 'bg-background border-border hover:border-muted-foreground'}`}>
            <input type="radio" {...register('payment_method')} value="nagad" className="hidden" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Nagad</span>
            <span className="text-xs font-bold text-foreground">{PAYMENT.NAGAD}</span>
          </label>
        </div>

        <div className="space-y-4">
          <div className="group">
            <input 
              {...register('transaction_id')}
              placeholder="Transaction ID (TXID)" 
              className={`w-full bg-background border ${errors.transaction_id ? 'border-destructive' : 'border-border'} rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-black tracking-widest uppercase`}
            />
            {errors.transaction_id && <p className="text-[10px] text-destructive mt-1.5 ml-1 font-bold uppercase">{errors.transaction_id.message}</p>}
          </div>

          <div className="group">
            <input 
              {...register('payment_number')}
              placeholder="Phone number you paid from" 
              className={`w-full bg-background border ${errors.payment_number ? 'border-destructive' : 'border-border'} rounded-2xl py-4 px-6 outline-none focus:border-primary transition-all text-sm font-medium`}
            />
            {errors.payment_number && <p className="text-[10px] text-destructive mt-1.5 ml-1 font-bold uppercase">{errors.payment_number.message}</p>}
          </div>

          <div className="relative">
            <label className={`flex flex-col items-center justify-center gap-4 w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${filePreview ? 'bg-primary/5 border-primary' : 'bg-background border-border hover:border-primary/50'}`}>
              <input 
                type="file" 
                {...register('screenshot')}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              {filePreview ? (
                <div className="relative w-full h-full p-2">
                  <img src={filePreview} alt="Payment Preview" className="w-full h-full object-contain rounded-2xl" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud size={32} className="text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest mb-1 text-foreground">Upload Screenshot</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">JPG, PNG (Max 5MB)</p>
                  </div>
                </>
              )}
            </label>
            {errors.screenshot && <p className="text-[10px] text-destructive mt-2 text-center font-bold uppercase tracking-widest">{errors.screenshot.message as string}</p>}
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Submitting Enrollment...
          </>
        ) : (
          <>
            Confirm Enrollment
            <Send size={24} />
          </>
        )}
      </button>
    </form>
  );
};

export default EnrollmentForm;
