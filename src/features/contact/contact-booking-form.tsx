import { Button, buttonVariants } from '#/components/ui/button'
import { Calendar } from '#/components/ui/calendar'
import { Card, CardContent } from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '#/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Separator } from '#/components/ui/separator'
import { disablePastDates, generateTimeSlots } from '#/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconCalendarCheck,
  IconCalendarEvent,
  IconClock,
  IconClockCheck,
  IconRestore,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { Fragment, useState } from 'react'
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const instantBookingFormSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be at most 100 characters'),
    mobileNumber: z.string().min(1, 'Mobile number is required'),
    address: z
      .string()
      .min(1, 'Address is required')
      .max(100, 'Address must be at most 200 characters'),
    city: z
      .string()
      .min(1, 'City is required')
      .max(30, 'City must be at most 100 characters'),
    zipcode: z.string().min(1, 'Pincode is required'),
    preferredTime: z.string().min(1, 'Preferred time is required'),
    preferredDate: z.date().min(new Date(), 'Preferred date is required'),
    testRequirement: z
      .string()
      .min(10, 'Test requirement is required')
      .max(500, 'Test requirement must be at most 500 characters'),
    agreeOfTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to our privacy policy',
    }),
  })
  .superRefine((data, ctx) => {
    // number look like this: +91 1234567890 +91 WITH SPACE 10 DIGITS
    function isValidMobileNumber(mobileNumber: string): boolean {
      return /^(\+91\s?)?[0-9]{10}$/.test(mobileNumber)
    }

    if (!isValidMobileNumber(data.mobileNumber)) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Mobile number must be 10 digits and can optionally start with +91',
      })
    }

    // pincode validation for India (6 digits)
    if (!/^[0-9]{6}/.test(data.zipcode)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Pincode must be 6 digits',
      })
    }
  })

type InstantBookingFormData = z.infer<typeof instantBookingFormSchema>

const today = new Date()

const isDev = import.meta.env.DEV

export default function ContactBookingForm() {
  const [date, setDate] = useState<Date | undefined>(today)

  const slots = generateTimeSlots('06:00', '22:00', 15)

  const form = useForm<InstantBookingFormData>({
    resolver: zodResolver(instantBookingFormSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      address: '',
      city: '',
      zipcode: '',
      preferredTime: '',
      preferredDate: today,
      testRequirement: '',
      agreeOfTerms: false,
    },
    mode: 'onChange',
  })

  const watchedTestRequirement = useWatch({
    name: 'testRequirement',
    control: form.control,
    defaultValue: '',
    compute: (value) => {
      if (value.length > 500) {
        return 0
      }
      return 500 - value.length
    },
  })

  const onError: SubmitErrorHandler<InstantBookingFormData> = (errors) => {
    // console.log('Form submission errors:', errors)
    Object.values(errors).forEach((error) => {
      if (error.message) {
        toast.error(error.message, {
          position: 'bottom-right',
          style: {
            '--border-radius': 'calc(var(--radius)  + 4px)',
          } as React.CSSProperties,
        })
      }
    })
    return
  }

  const onSubmit: SubmitHandler<InstantBookingFormData> = (data) => {
    console.log('Form submitted successfully:', data)
    toast('You submitted the following values:', {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
      classNames: {
        content: 'flex flex-col gap-2',
      },
      style: {
        '--border-radius': 'calc(var(--radius)  + 4px)',
      } as React.CSSProperties,
    })
  }

  return (
    <Card className={'rounded-none shadow-none ring-0'}>
      <CardContent className={'px-2'}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FieldGroup className={'gap-3 relative'}>
            {isDev ? (
              <Button
                variant={'destructive'}
                size={'icon-xs'}
                type="button"
                className={'absolute top-0.5 right-2'}
                onClick={() => form.reset()}
              >
                <IconRestore className={'size-4'} />
              </Button>
            ) : null}
            <FieldSet className={'gap-3'}>
              <FieldLegend>Book a Test / Contact Us</FieldLegend>
              <FieldDescription>
                Please fill out the form below to book a test or contact us. Our
                team will get back to you as soon as possible.
              </FieldDescription>
              <FieldSeparator />
              <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="full-name">Full name</FieldLabel>
                      <Input
                        id="full-name"
                        placeholder="Evil Rabbit"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="mobileNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="mobile-number">
                        Mobile Number
                      </FieldLabel>
                      <Input
                        id="mobile-number"
                        placeholder="+91 1234567890"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </div>
              <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="address">Address</FieldLabel>
                      <Input
                        id="address"
                        placeholder="123 Main St, City, State"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="city"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="city">City</FieldLabel>
                      <Input
                        id="city"
                        placeholder="City"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </div>
              <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                <Controller
                  name="zipcode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="zipcode">Pincode</FieldLabel>
                      <Input
                        id="zipcode"
                        placeholder="000000"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="preferredTime"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="preferred-time">
                        Preferred Time
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          id="preferred-time"
                          aria-invalid={fieldState.invalid}
                        >
                          {field.value ? (
                            <>
                              <SelectValue>
                                <IconClockCheck className={'size-4'} />
                                {field.value}
                              </SelectValue>
                            </>
                          ) : (
                            <span
                              className={
                                'flex items-center justify-start gap-1.5'
                              }
                            >
                              <IconClock />
                              <SelectValue placeholder="Select a time slot" />
                            </span>
                          )}
                        </SelectTrigger>
                        <SelectContent
                          popover="hint"
                          position="popper"
                          id="preferred-time"
                        >
                          <SelectGroup>
                            <SelectLabel>Preferred time slot</SelectLabel>
                            {slots.map((slot) => (
                              <Fragment key={slot}>
                                <SelectItem value={slot}>
                                  <IconClock />
                                  {slot}
                                </SelectItem>
                                <Separator className="my-2" />
                              </Fragment>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="preferredDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    aria-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="preferred-date">
                      Preferred Date
                    </FieldLabel>

                    <Popover>
                      <PopoverTrigger
                        asChild
                        id="preferred-date"
                        aria-invalid={fieldState.invalid}
                      >
                        <Button variant="outline">
                          {date ? (
                            <span className={'flex items-center gap-1.5'}>
                              <IconCalendarCheck className={'size-4'} />
                              {date.toDateString()}
                            </span>
                          ) : (
                            <span className={'flex items-center gap-1.5'}>
                              <IconCalendarEvent className={'size-4'} />
                              Select a date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full p-0"
                        align="start"
                        id="preferred-date"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate)
                            field.onChange(selectedDate)
                          }}
                          className="w-full"
                          disabled={(disabledDate) =>
                            disablePastDates(disabledDate)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                )}
              />

              <Controller
                name="testRequirement"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    aria-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="test-requirement">
                      Message / Test Requirement
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        placeholder="Please describe your test requirement or query"
                        className="resize-none min-h-30"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="text-xs text-muted-foreground">
                          {watchedTestRequirement || 500} characters left
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                )}
              />

              <Controller
                name="agreeOfTerms"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    aria-invalid={fieldState.invalid}
                  >
                    <Checkbox
                      id="agree-of-terms"
                      aria-invalid={fieldState.invalid}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor="agree-of-terms">
                        I agree to be contacted regarding my enquiry.
                      </FieldLabel>
                      <FieldDescription>
                        By submitting this form, you consent to the processing
                        of your personal data in accordance with our privacy
                        policy.{' '}
                        <Link
                          to="/privacy-policy"
                          className={buttonVariants({
                            variant: 'link',
                            className: 'rounded-none h-fit',
                          })}
                          viewTransition
                        >
                          Read our privacy policy
                        </Link>
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldSet>

            <Field orientation="horizontal">
              <Button type="submit" className={'w-full'}>
                Submit Request
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
