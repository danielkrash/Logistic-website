'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useState, useEffect } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Office, Company } from '@/types/dashboard'
import useSWR from 'swr'
import { user_fetcher } from '@/lib/user_actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { company_fetcher } from '@/lib/company_actions'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { createPackagePartial } from '@/lib/package_actions'
import { GetOffices } from '@/lib/office_actions'
import { Loader2, MapPin, Building, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
const formSchema = z
  .object({
    senderEmail: z.string().email('Please enter a valid email address'),
    receiverEmail: z.string().email('Please enter a valid email address'),
    weight: z
      .string()
      .min(1, 'Weight is required')
      .refine(
        val => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Weight must be a positive number',
      ),
    deliveryAddress: z.string().min(1, 'Delivery address is required'),
    companyId: z.number().min(1, 'Please select a company'),
    description: z.string().min(1, 'Description is required'),
    fragile: z.boolean(),
    hazardous: z.boolean(),
    useOfficeAddress: z.boolean(),
    selectedOfficeId: z.string().optional(),
    customAddress: z.string().optional(),
  })
  .refine(
    data => {
      // If using office address, selectedOfficeId is required
      if (data.useOfficeAddress) {
        return data.selectedOfficeId && data.selectedOfficeId.length > 0
      }
      // If using custom address, customAddress is required
      return data.customAddress && data.customAddress.length > 0
    },
    {
      message: 'Please select an office or enter a custom address',
      path: ['deliveryAddress'],
    },
  )

function useUsers() {
  const { data, isLoading } = useSWR('http://localhost:7028/users', user_fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })
  return {
    users: data,
    isLoading,
  }
}

function useCompanies() {
  const { data, isLoading } = useSWR('http://localhost:7028/company', company_fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })
  return {
    companies: data,
    isLoading,
  }
}

function useOffices() {
  const { data, isLoading } = useSWR(
    'http://localhost:7028/offices',
    async () => {
      return await GetOffices()
    },
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    },
  )
  return {
    offices: data,
    isLoading,
  }
}

type PackageCreateData = z.infer<typeof formSchema>

export function CreatePackage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showEditDialog, setEditDialog] = useState(false)
  const [selectedCompanyOffices, setSelectedCompanyOffices] = useState<Office[]>([])

  const { companies, isLoading: companiesLoading } = useCompanies()
  const { users, isLoading: usersLoading } = useUsers()
  const { offices, isLoading: officesLoading } = useOffices()

  const form = useForm<PackageCreateData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderEmail: '',
      receiverEmail: '',
      deliveryAddress: '',
      weight: '0',
      companyId: 0,
      description: '',
      fragile: false,
      hazardous: false,
      useOfficeAddress: true,
      selectedOfficeId: '',
      customAddress: '',
    },
  })

  const watchedCompanyId = form.watch('companyId')
  const watchedUseOfficeAddress = form.watch('useOfficeAddress')
  const watchedSelectedOfficeId = form.watch('selectedOfficeId')

  // Update available offices when company changes
  useEffect(() => {
    if (watchedCompanyId && offices) {
      const companyOffices = offices.filter(office => office.companyId === watchedCompanyId)
      setSelectedCompanyOffices(companyOffices)

      // Reset office selection when company changes
      form.setValue('selectedOfficeId', '')
      form.setValue('deliveryAddress', '')
    }
  }, [watchedCompanyId, offices, form])

  // Auto-fill address when office is selected
  useEffect(() => {
    if (watchedUseOfficeAddress && watchedSelectedOfficeId && selectedCompanyOffices) {
      const selectedOffice = selectedCompanyOffices.find(
        office => office.id?.toString() === watchedSelectedOfficeId,
      )
      if (selectedOffice?.address) {
        form.setValue('deliveryAddress', selectedOffice.address)
      }
    }
  }, [watchedUseOfficeAddress, watchedSelectedOfficeId, selectedCompanyOffices, form])

  // Clear delivery address when switching to custom address
  useEffect(() => {
    if (!watchedUseOfficeAddress) {
      form.setValue('deliveryAddress', form.getValues('customAddress') || '')
    }
  }, [watchedUseOfficeAddress, form])

  async function handleSubmit(data: PackageCreateData) {
    setIsLoading(true)

    try {
      // Find the selected company name
      const selectedCompany = companies?.find(company => company.id === data.companyId)
      if (!selectedCompany) {
        toast({
          title: 'Error',
          description: 'Selected company not found',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      let formData = new FormData()
      formData.append('senderEmail', data.senderEmail)
      formData.append('receiverEmail', data.receiverEmail)
      formData.append('deliveryAddress', data.deliveryAddress)
      formData.append('weight', String(parseFloat(data.weight))) // Convert to number then string
      formData.append('companyName', selectedCompany.name || '') // Send company name, not ID
      formData.append('description', data.description)
      formData.append('fragile', data.fragile ? 'true' : 'false') // Convert boolean to string
      formData.append('hazardous', data.hazardous ? 'true' : 'false') // Convert boolean to string
      formData.append('toAdress', data.useOfficeAddress ? 'false' : 'true') // toAdress field (note the typo in API)

      const result = await createPackagePartial(formData)

      if (result?.success === true) {
        toast({
          title: 'Success',
          description: 'Package has been created successfully.',
        })
        setEditDialog(false)
        // Reset form
        form.reset()
        // Refresh the page to show updated package list
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: result?.error || 'Failed to create package',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formButtonRef = React.useRef<HTMLButtonElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  return (
    <>
      <Button variant={'outline'} onClick={() => setEditDialog(true)}>
        <Package className="mr-2 h-4 w-4" />
        Create Package
      </Button>
      <AlertDialog open={showEditDialog} onOpenChange={setEditDialog}>
        <AlertDialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Create New Package
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Sender and Receiver Section */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="senderEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Email</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={usersLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={usersLoading ? 'Loading users...' : 'Select sender'}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map(user => (
                            <SelectItem key={user.id} value={user.email!}>
                              {user.email!}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiverEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver Email</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={usersLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={usersLoading ? 'Loading users...' : 'Select receiver'}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map(user => (
                            <SelectItem key={user.id} value={user.email!}>
                              {user.email!}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Company Selection */}
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Company</FormLabel>
                    <Select
                      onValueChange={value => field.onChange(parseInt(value, 10))}
                      defaultValue={field.value?.toString()}
                      disabled={companiesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              companiesLoading ? 'Loading companies...' : 'Select shipping company'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies?.map(company => (
                          <SelectItem key={company.id} value={company.id!.toString()}>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {company.name!}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Address Selection Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </CardTitle>
                  <CardDescription>
                    Choose between office delivery or custom address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address Type Selection */}
                  <FormField
                    control={form.control}
                    name="useOfficeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={value => field.onChange(value === 'office')}
                            value={field.value ? 'office' : 'custom'}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="office" id="office" />
                              <label htmlFor="office" className="text-sm font-medium leading-none">
                                Deliver to company office
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="custom" id="custom" />
                              <label htmlFor="custom" className="text-sm font-medium leading-none">
                                Deliver to custom address
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Office Selection (when office address is selected) */}
                  {watchedUseOfficeAddress && (
                    <FormField
                      control={form.control}
                      name="selectedOfficeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Office</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!watchedCompanyId || selectedCompanyOffices.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !watchedCompanyId
                                      ? 'Select a company first'
                                      : selectedCompanyOffices.length === 0
                                        ? 'No offices available'
                                        : 'Select office address'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedCompanyOffices.map(office => (
                                <SelectItem key={office.id} value={office.id!.toString()}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">Office {office.id}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {office.address}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Custom Address Input (when custom address is selected) */}
                  {!watchedUseOfficeAddress && (
                    <FormField
                      control={form.control}
                      name="customAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Delivery Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the complete delivery address..."
                              className="resize-none"
                              {...field}
                              onChange={e => {
                                field.onChange(e)
                                form.setValue('deliveryAddress', e.target.value)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Final Address Display */}
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Final Delivery Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Address will be auto-filled"
                            readOnly={watchedUseOfficeAddress}
                            className={watchedUseOfficeAddress ? 'bg-muted' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Separator />

              {/* Package Details Section */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="0.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of package contents" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Package Options */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fragile"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Fragile Package</FormLabel>
                        <FormDescription>
                          Check if your package contains fragile items
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hazardous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Hazardous Materials</FormLabel>
                        <FormDescription>
                          Check if your package contains hazardous materials
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button className="hidden" ref={formButtonRef} type="submit" />
            </form>
          </Form>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button onClick={() => formRef.current?.requestSubmit()} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Package
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
