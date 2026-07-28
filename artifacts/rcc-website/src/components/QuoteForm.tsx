import React, { useEffect } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { useSubmitQuote, useListServices } from '@workspace/api-client-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  canton: z.string().min(2, 'Canton is required'),
  serviceType: z.string().min(1, 'Service is required'),
  carType: z.string().min(1, 'Car type is required'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function QuoteForm() {
  const { t, lang } = useTranslation();
  const submitQuote = useSubmitQuote();
  const { data: services } = useListServices({ query: { queryKey: ['services'] } });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      canton: '',
      serviceType: '',
      carType: '',
      message: '',
    }
  });

  // Listen for custom events from map and services sections
  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent;
      form.setValue('serviceType', customEvent.detail);
    };

    const handleSelectCanton = (e: Event) => {
      const customEvent = e as CustomEvent;
      form.setValue('canton', customEvent.detail);
    };

    window.addEventListener('select-service', handleSelectService);
    window.addEventListener('select-canton', handleSelectCanton);
    return () => {
      window.removeEventListener('select-service', handleSelectService);
      window.removeEventListener('select-canton', handleSelectCanton);
    };
  }, [form]);

  const onSubmit = (data: FormValues) => {
    submitQuote.mutate({ data });
  };

  const getLocalizedServiceName = (service: any) => {
    const key = `name${lang.toUpperCase()}` as keyof typeof service;
    return service[key];
  };

  if (submitQuote.isSuccess) {
    return (
      <section id="quote" className="py-24 bg-[#111] relative border-b border-white/5">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A1A1A] border border-primary/30 p-12 flex flex-col items-center"
          >
            <CheckCircle2 className="w-20 h-20 text-primary mb-6" />
            <h2 className="text-3xl font-serif text-white mb-4">{t.quote.form.successTitle}</h2>
            <p className="text-white/70">{t.quote.form.successDesc}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-24 bg-[#111] relative border-b border-white/5">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">{t.quote.title}</h2>
          <p className="text-white/60 mb-6">{t.quote.subtitle}</p>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <div className="bg-[#1A1A1A] p-8 md:p-12 border border-white/5 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase tracking-wide text-xs">{t.quote.form.name}</FormLabel>
                      <FormControl>
                        <Input data-testid="input-name" placeholder="E.g. Hans Müller" {...field} className="bg-[#0A0A0A] border-white/10 text-white rounded-none focus-visible:ring-primary h-12" />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase tracking-wide text-xs">{t.quote.form.email}</FormLabel>
                      <FormControl>
                        <Input data-testid="input-email" type="email" placeholder="email@example.com" {...field} className="bg-[#0A0A0A] border-white/10 text-white rounded-none focus-visible:ring-primary h-12" />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase tracking-wide text-xs">{t.quote.form.phone}</FormLabel>
                      <FormControl>
                        <Input data-testid="input-phone" type="tel" placeholder="+41 79 000 00 00" {...field} className="bg-[#0A0A0A] border-white/10 text-white rounded-none focus-visible:ring-primary h-12" />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canton"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase tracking-wide text-xs">{t.quote.form.canton}</FormLabel>
                      <FormControl>
                        <Input data-testid="input-canton" placeholder="ZH, GE, BE..." {...field} className="bg-[#0A0A0A] border-white/10 text-white rounded-none focus-visible:ring-primary h-12" />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase tracking-wide text-xs">{t.quote.form.serviceType}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-service-type" className="bg-[#0A0A0A] border-white/10 text-white rounded-none focus:ring-primary h-12">
                            <SelectValue placeholder="Select Service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                          {services?.map(s => (
                            <SelectItem data-testid={`option-service-${s.id}`} key={s.id} value={s.id} className="focus:bg-primary/20 focus:text-primary cursor-pointer">
                              {getLocalizedServiceName(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 uppercase tracking-wide text-xs">{t.quote.form.carType}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-car-type" className="bg-[#0A0A0A] border-white/10 text-white rounded-none focus:ring-primary h-12">
                            <SelectValue placeholder="Select Car Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                          {Object.entries(t.quote.carTypes).map(([key, value]) => (
                            <SelectItem data-testid={`option-car-${key}`} key={key} value={key} className="focus:bg-primary/20 focus:text-primary cursor-pointer">
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80 uppercase tracking-wide text-xs">{t.quote.form.message}</FormLabel>
                    <FormControl>
                      <Textarea 
                        data-testid="input-message"
                        placeholder="Details about your car or specific requests..." 
                        {...field} 
                        className="bg-[#0A0A0A] border-white/10 text-white rounded-none focus-visible:ring-primary min-h-[120px] resize-none" 
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                data-testid="button-submit-quote"
                disabled={submitQuote.isPending}
                className="w-full btn-gold bg-primary text-black font-semibold h-14 uppercase tracking-widest text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {submitQuote.isPending ? t.quote.form.submitting : t.quote.form.submit}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
