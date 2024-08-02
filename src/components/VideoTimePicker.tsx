import React, { useEffect, useState } from 'react';
import { TimePicker } from 'antd';
import moment, { Moment } from 'moment';

interface IPickerProps {
  disabled: boolean,
  startTimeNumber?: number,
  endTimeNumber?: number,
  initialValues?: any,
  format: string,
  setStartNumber: any
}

export const VideoTimePicker: React.FunctionComponent<IPickerProps> = (props) => {
  const {disabled, startTimeNumber, endTimeNumber, initialValues, setStartNumber, format } = props

  const [selectTime, setSelectTime] = useState<any>();

  useEffect(() => {
    if(selectTime === undefined || initialValues === undefined){
      setSelectTime(initialValues)
    }
  }, [initialValues]);

  return (
    <TimePicker 
      size="small"
      allowClear={true}
      disabled={disabled}
      disabledHours={
        () => {
          let minHour = 24
          let maxHour = 0
          if(startTimeNumber !== undefined) {
            minHour = moment.unix(startTimeNumber).utc().hour()
          }

          if(endTimeNumber) {
            maxHour = moment.unix(endTimeNumber).utc().hour()
          }
          const hours = Array.from(Array(24), (v, k) => k);

          if(minHour > maxHour) {
            return hours.filter(c=> c > maxHour && c < minHour)
          }
          else {
            return hours.filter(c=> c > maxHour || c < minHour)
          }
        }
      }
      disabledMinutes = {
        (currentHour) => {
          let minMinute = 60
          let maxMinute = 0
          const minutes = Array.from(Array(60), (v, k) => k);

          if(startTimeNumber !== undefined) {
            minMinute = moment.unix(startTimeNumber).utc().minute()
          }

          if(endTimeNumber) {
            let leftTime = endTimeNumber
            if(currentHour >= 0) {
              leftTime = endTimeNumber - currentHour * 60 * 60;              
            }

            const leftMoment = moment.unix(leftTime).utc()
            maxMinute = leftMoment.hour() > 0 ? 60 : leftMoment.minute()
          }

          if(minMinute > maxMinute) {
            return minutes.filter(c=> c > maxMinute && c < minMinute)
          }
          else if(minMinute === maxMinute) {
            return minutes.filter(c=> c > maxMinute)
          }
          else {
            return minutes.filter(c=> c > maxMinute || c < minMinute)
          }
        }
      }
      disabledSeconds = {
        (currentHour, currentMinute) => {
          const seconds = Array.from(Array(60), (v, k) => k);
          let disableSeconds : number[] = [];

          if(startTimeNumber !== undefined) {
            const startTime = moment.unix(startTimeNumber).utc()
            if(startTime.minute() === currentMinute) {
              seconds.filter(c=> c <= startTime.second()).map(c=> disableSeconds.push(c));
            }
          }

          let maxSecond = 0

          if (endTimeNumber) {            
            let leftTime = endTimeNumber
            if(currentHour < 0 && currentMinute >= 0) {
              leftTime = endTimeNumber - currentMinute * 60;
              maxSecond = leftTime > 60 ?  60 : leftTime
            }
            else if (currentHour >= 0 && currentMinute >= 0) {
              leftTime = endTimeNumber - currentHour * 60 * 60 - currentMinute * 60;
              maxSecond = leftTime > 60 ?  60 : leftTime
            }
            else {
              maxSecond = 60
            }
          }

          seconds.filter(c=> c >= maxSecond).map(c=> disableSeconds.push(c));
          return disableSeconds
        }
      }
      value = {selectTime}
      defaultValue={initialValues}
      format={format}
      placeholder={'开始时间'}
      showNow={false}
      hideDisabledOptions={true}
      onSelect = {(value) => {
        if(value) {
          setSelectTime(value)
        }
      }}
      onOpenChange={(open) => {
        if(!open && selectTime) {
          const cloneTime = selectTime.clone()
          const offset = cloneTime.utcOffset()
          let hour = 0
          if(offset > 0) {
            const utcTime = cloneTime.utc()
            const utcHour = utcTime.hour()
            hour = Math.abs(utcHour + offset / 60 - 24)
          }
          else if(offset < 0) {
            const utcTime = cloneTime.utc()
            const utcHour = utcTime.hour()
            hour = Math.abs(utcHour + offset / 60)
          }
          else {
            hour = cloneTime.hour()
          }

          const minute = cloneTime.minute()
          const second = cloneTime.second()
          setStartNumber(hour * 60 * 60 + minute * 60 + second)
        }
      }}
    />
  )
}
