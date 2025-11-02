import Devider from 'components/Devider'
import Title from 'components/Title'
import Button from 'components/form/button'
import Input from 'components/form/input'
// import Select from 'components/form/select'
import { privateRequest } from 'config/axios.config'
import { useGetSingleDoctor } from 'hooks/doctor'
import { useAllHospitalsOptions } from 'hooks/hospital'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import { errorHandler } from 'utils/errorHandler'
import { assetUrl } from 'utils/url'

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

interface Payload {
  name: string
  phone: string
  dialCode: string
  specialty: string[]
  hospital: string[]
  about: string
  bmdcCode: string
  experienceInYear: string
  consultationFee: string
  consultationFeeUsd: string
  followupFee: string
  photo: string
  gender: string
}

interface DoctorUpdatePayload extends Payload {
  id: string
}

type State = {
  name: string
  phone: string
  dialCode: string
  specialty?: Option[]
  hospital?: Option[]
  about: string
  bmdcCode: string
  experienceInYear: string
  consultationFee: string
  consultationFeeUsd: string
  followupFee: string
  photo: string
  gender?: Option
}

type Errors = {
  name?: string
  phone?: string
  dialCode?: string
  specialty?: string
  hospital?: string
  about?: string
  bmdcCode?: string
  experienceInYear?: string
  consultationFee?: string
  consultationFeeUsd?: string
  followupFee?: string
  gender?: string
  photo?: string
}

export default function AddUpdateDoctorPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const id = useParams().id
  const { data } = useGetSingleDoctor(id)

  console.log(data)

  const [form, setForm] = useState<State>({
    name: '',
    phone: '',
    dialCode: '',
    about: '',
    bmdcCode: '',
    experienceInYear: '',
    consultationFee: '',
    consultationFeeUsd: '',
    followupFee: '',
    photo: '',
  })

  const [errors, setErrors] = useState<Errors>({})

  const [attachment, setAttachment] = useState<File | null>(null) // Store selected image

  const avatar =
    (attachment && URL.createObjectURL(attachment)) ||
    (form?.photo && form.photo !== 'null' ? assetUrl + form.photo : null)


   const uploadAvatarMutation = useMutation<{ message: string }, Error, FormData>(
    (payload) =>
      privateRequest.post('admin/doctor/uploadProfilePhoto', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    {
      onError: () => {
        setAttachment(null)
      },
    },
  )   
  const uploadAvatar = (e: _ChangeHandlerEventInput) => {
    const file = e.target.files?.[0]

    if (!file) return

    const size = Math.floor(file.size / 1000)
    if (size > 1024 * 5) {
      toast.error('File size does not allow more than 5 MB')
      return
    }
    setAttachment(file)
    const formData = new FormData()
    formData.append('attachment', file)

    uploadAvatarMutation.mutate(formData)
  }

  const addDoctor = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const formData = new FormData()

        // Append form data
        Object.entries(payload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((val) => formData.append(`${key}[]`, val)) // Append array elements properly
          } else {
            formData.append(key, value as string)
          }
          // formData.append(key, value as string)
        })

        // Append image if selected
        if (attachment) {
          formData.append('attachment', attachment)
        }

        console.log(formData)
        const res = await privateRequest.post('admin/doctor', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        return res.data
      } catch (error) {
        errorHandler(error)
      }

      // try {
      //   const res = await privateRequest.post('admin/doctor', payload)
      //   return res.data
      // } catch (error) {
      //   errorHandler(error)
      // }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('doctors')
        navigate(-1)
      },
    },
  )
  const updateDoctor = useMutation<{ message: string }, Error, DoctorUpdatePayload>(
    async (payload) => {
      try {
        const formData = new FormData()

        // Append form data
        Object.entries(payload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((val) => formData.append(`${key}[]`, val)) // Append array elements properly
          } else {
            formData.append(key, value as string)
          }
          // formData.append(key, value as string)
        })

        // Append image if selected
        if (attachment) {
          formData.append('attachment', attachment)
        }

        console.log(formData)
        const res = await privateRequest.patch('admin/doctor', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        return res.data
      } catch (error) {
        errorHandler(error)
      }

      // try {
      //   const res = await privateRequest.patch(`admin/doctor`, payload)
      //   return res.data
      // } catch (error) {
      //   errorHandler(error)
      // }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('doctors')
        queryClient.invalidateQueries('doctor-details')
        navigate(-1)
      },
    },
  )

  const { data: specialist, isLoading: specialistLoading } = useQuery<Option[], Error>(
    'hospitalsOptions',
    async () => {
      try {
        const res = await privateRequest.get('admin/specialty?limit=-1')
        return res.data.data.docs?.map((el: any) => ({
          label: el.title,
          value: el._id,
        }))
      } catch (error) {
        errorHandler(error)
      }
    },
  )

  const { data: hospitalOptions, isLoading: hospitalsLoading } = useAllHospitalsOptions()

  useEffect(() => {
    if (!data) return

    const specialtyArray = Array.isArray(data?.specialty)
      ? data.specialty
      : data?.specialty
      ? [data.specialty]
      : []

    const hospitalArray = Array.isArray(data?.hospital)
      ? data.hospital
      : data?.hospital
      ? [data.hospital]
      : []

    setForm((prev) => ({
      ...prev,
      name: data?.name ?? '',
      phone: data?.phone ?? '',
      dialCode: '',
      about: data?.about ?? '',
      bmdcCode: data?.bmdcCode ?? '',
      experienceInYear: data?.experienceInYear !== undefined ? String(data?.experienceInYear) : '',
      consultationFee: data?.consultationFee !== undefined ? String(data?.consultationFee) : '',
      consultationFeeUsd:
        data?.consultationFeeUsd !== undefined ? String(data?.consultationFeeUsd) : '',
      followupFee: data?.followupFee !== undefined ? String(data?.followupFee) : '',
      photo: data?.photo !== undefined ? String(data?.photo) : '',
      gender: genderOptions.find((el) => el.value === data?.gender),
      hospital: hospitalArray
        .map((spec) => hospitalOptions?.find((el) => el.value === spec._id) as Option)
        .filter((el): el is Option => Boolean(el)),
      specialty: specialtyArray
        .map((spec) => specialist?.find((el) => el.value === spec._id) as Option)
        .filter((el): el is Option => Boolean(el)),
    }))
  }, [data, hospitalOptions, specialist])

  const changeHandler = ({ target: { name, value } }: _ChangeHandlerEvent) => {
    if (
      name === 'consultationFee' ||
      name === 'consultationFeeUsd' ||
      name === 'followupFee' ||
      name === 'experienceInYear'
    ) {
      if (isNaN(Number(value))) return
    }
    if (name === 'phone' && value.length === 1 && value === '0') return
    if (name === 'phone' && value.length > 10) return

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const selectHandlerGender = (selectedOption: Option | null, actionMeta: { name: string }) => {
    setForm((prev) => ({
      ...prev,
      [actionMeta.name]: selectedOption || '', // Ensure it's always a valid value
    }))

    setErrors((prev) => ({
      ...prev,
      [actionMeta.name]: '',
    }))
  }

  const selectHandler = (selectedOptions: Option[], { name }: { name: string }) => {
    setForm((prev) => ({
      ...prev,
      [name]: selectedOptions || [], // Ensure it's always an array
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const submitHandler = (e: _FormSubmitEvent) => {
    e.preventDefault()

    const payload: Payload = {
      dialCode: '+880',
      specialty: Array.isArray(form.specialty)
        ? form.specialty.map((spec) => spec.value) // Extract values from the array
        : [], // Ensure it's always an array
      hospital: Array.isArray(form.hospital)
        ? form.hospital.map((spec) => spec.value) // Extract values from the array
        : [], // Ensure it's always an array
      gender: form.gender?.value ?? '',
      name: form.name,
      phone: form.phone,
      about: form.about,
      bmdcCode: form.bmdcCode,
      experienceInYear: form.experienceInYear,
      consultationFee: form.consultationFee,
      consultationFeeUsd: form.consultationFeeUsd,
      followupFee: form.followupFee,
      photo: form.photo,
    }

    console.log(payload)
    console.log('**')

    if (
      !form.name ||
      !form.phone ||
      !form.specialty?.length ||
      !form.hospital?.length ||
      !form.about ||
      !form.bmdcCode ||
      !form.experienceInYear ||
      !form.consultationFee ||
      !form.consultationFeeUsd ||
      !form.followupFee ||
      !form.gender
    ) {
      setErrors((prev) => ({
        ...prev,
        name: !form.name ? 'Name is required' : '',
        phone: !form.phone ? 'Phone is required' : '',
        specialty: !form.specialty?.length ? 'Specialty is required' : '',
        hospital: !form.hospital?.length ? 'Hospital is required' : '',
        about: !form.about ? 'About is required' : '',
        bmdcCode: !form.bmdcCode ? 'BMDC Code is required' : '',
        experienceInYear: !form.experienceInYear ? 'Experience is required' : '',
        consultationFee: !form.consultationFee ? 'Consultation Fee is required' : '',
        consultationFeeUsd: !form.consultationFeeUsd ? 'Consultation Fee Usd is required' : '',
        followupFee: !form.followupFee ? 'Followup Fee is required' : '',
        gender: !form.gender?.value ? 'Gender is required' : '',
      }))
      return
    }

    if (form.phone.length < 10) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Phone number must be 10 digits',
      }))
      return
    }

    if (id) {
      toast.promise(updateDoctor.mutateAsync({ ...payload, id }), {
        loading: 'Updating doctor...',
        success: (res) => res.message ?? 'Doctor updated successfully',
        error: (err) => err.message ?? 'Something went wrong!',
      })
    } else {
      toast.promise(addDoctor.mutateAsync(payload), {
        loading: 'Adding doctor...',
        success: (res) => res.message ?? 'Doctor added successfully',
        error: (err) => err.message ?? 'Something went wrong!',
      })
    }
  }

  return (
    <div className='card'>
      <Title variant='card_title'>Add New Doctor</Title>
      <Devider />
      <form onSubmit={submitHandler} className='grid lg:grid-cols-2 gap-10'>
        <div className='flex flex-col gap-5'>
          <Input
            value={form.name}
            onChange={changeHandler}
            name='name'
            label='Full Name'
            placeholder='Enter the full name'
            helpText={errors.name}
            error={!!errors.name}
          />
          <Input
            onChange={changeHandler}
            value={form.phone}
            label='Phone'
            type='number'
            name='phone'
            placeholder='1XXXXXXXXX'
            prefix={<span className='mr-2 select-none'>+880</span>}
            helpText={errors.phone}
            error={!!errors.phone}
          />

          <div className='w-full'>
            <label
              htmlFor='specialty'
              className='flex items-center text-sm font-medium text-slate-500 mb-2'
            >
              Select Specialist
            </label>
            <Select
              isMulti
              name='specialty'
              placeholder='Select Specialist'
              options={specialist ?? []}
              className='basic-multi-select'
              classNamePrefix='select'
              value={form.specialty}
              onChange={selectHandler}
              style={{ marginTop: '0' }}
            />

            {errors.specialty && (
              <p className='error-message text-red-500 text-sm font-semibold my-1'>
                {errors.specialty}
              </p>
            )}
          </div>

          {/* <Select
            options={specialist ?? []}
            value={form.specialty}
            onChange={selectHandler}
            name='specialty'
            label='Specialist In'
            placeholder='Select specialist'
            helpText={errors.specialty}
            error={!!errors.specialty}
            isLoading={specialistLoading}
          /> */}

          <div className='w-full'>
            <label
              htmlFor='hospital'
              className='flex items-center text-sm font-medium text-slate-500 mb-2'
            >
              Work Place
            </label>
            <Select
              isMulti
              name='hospital'
              placeholder='Select work place'
              options={hospitalOptions ?? []}
              className='basic-multi-select'
              classNamePrefix='select'
              value={form.hospital}
              onChange={selectHandler}
              style={{ marginTop: '0' }}
            />
            {errors.hospital && (
              <p className='error-message text-red-500 text-sm font-semibold my-1'>
                {errors.hospital}
              </p>
            )}
          </div>

          {/* <Select
            options={hospitalOptions ?? []}
            value={form.hospital}
            onChange={selectHandler}
            name='hospital'
            label='Work In'
            placeholder='Select work place'
            helpText={errors.hospital}
            error={!!errors.hospital}
            isLoading={hospitalsLoading}
            isMulti
          /> */}
          <Input
            name='about'
            value={form.about}
            onChange={changeHandler}
            multiline
            rows={6}
            label='About Doctor'
            placeholder='Write about Doctor'
            helpText={errors.about}
            error={!!errors.about}
          />
        </div>
        <div className='flex flex-col gap-5'>
          <Input
            name='bmdcCode'
            value={form.bmdcCode}
            onChange={changeHandler}
            label='BMDC No'
            helpText={errors.bmdcCode}
            error={!!errors.bmdcCode}
            placeholder=''
          />
          <Input
            name='experienceInYear'
            value={form.experienceInYear}
            onChange={changeHandler}
            label='Experience'
            placeholder=''
            afterFix={<span className='text-gray mr-4'>Years</span>}
            helpText={errors.experienceInYear}
            error={!!errors.experienceInYear}
          />
          <Input
            name='consultationFee'
            value={form.consultationFee}
            onChange={changeHandler}
            label='Consultation Fee'
            placeholder=''
            afterFix={<span className='text-slate-500 mr-4'>Tk.</span>}
            helpText={errors.consultationFee}
            error={!!errors.consultationFee}
          />
          <Input
            name='consultationFeeUsd'
            value={form.consultationFeeUsd}
            onChange={changeHandler}
            label='Consultation Fee Usd'
            placeholder=''
            afterFix={<span className='text-slate-500 mr-4'>Tk.</span>}
            helpText={errors.consultationFeeUsd}
            error={!!errors.consultationFeeUsd}
          />
          <Input
            name='followupFee'
            value={form.followupFee}
            onChange={changeHandler}
            label='Follow up Fee'
            placeholder=''
            afterFix={<span className='text-slate-500 mr-4'>Tk.</span>}
            helpText={errors.followupFee}
            error={!!errors.followupFee}
          />

          <div className='w-full'>
            <label
              htmlFor='gender'
              className='flex items-center text-sm font-medium text-slate-500 mb-2'
            >
              Gender
            </label>
            <Select
              name='gender'
              placeholder='Select Gender'
              options={genderOptions ?? []}
              className='basic-multi-select'
              classNamePrefix='select'
              value={form.gender}
              onChange={selectHandlerGender}
              style={{ marginTop: '0' }}
            />
            {errors.gender && (
              <p className='error-message text-red-500 text-sm font-semibold my-1'>
                {errors.gender}
              </p>
            )}
          </div>

          {/* <Select
            name='gender'
            value={form.gender}
            options={genderOptions}
            onChange={selectHandler}
            label='Gender'
            placeholder='Select Gender'
            helpText={errors.gender}
            error={!!errors.gender}
          /> */}
          <Input type='file' name='photo' label='Profile Image' onChange={uploadAvatar} />

          {avatar && (
            <div className='h-20 w-20 rounded-full bg-slate-200 overflow-hidden'>
              <img className='w-full h-full object-cover' src={avatar} alt='Avatar' />
            </div>
          )}

          <Button disabled={addDoctor.isLoading}>{id ? 'Update' : 'Submit'}</Button>
        </div>
      </form>
    </div>
  )
}
