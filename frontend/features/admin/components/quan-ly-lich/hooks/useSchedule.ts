"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { scheduleService } from "../services/scheduleService";
import { ScheduleListItem } from "../types/schedule.types";

export function useSchedule() {
  const [schedules, setSchedules] = useState<ScheduleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchSchedules = useCallback(
    async (page = 1, search = "") => {
      setIsLoading(true);
      try {
        const response = await scheduleService.getAll({
          page,
          limit: pagination.limit,
          search,
        });
        // Backend returns { message, data: { items, pagination }, errorCode }
        const { items, pagination: paging } = response.data;

        setSchedules(items || []);
        setPagination((prev) => ({
          ...prev,
          page: paging?.page || page,
          total: paging?.total || 0,
        }));
      } catch (error) {
        console.error(error);
        toast.error("Lỗi tải danh sách lịch");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit],
  );

  const createSchedule = async (data: any) => {
    try {
      await scheduleService.create(data);
      toast.success("Tạo lịch thành công");
      fetchSchedules(); // Reload data
    } catch (error) {
      console.error(error);
      toast.error("Tạo lịch thất bại");
      throw error;
    }
  };

  const updateSchedule = async (code: string, data: any) => {
    try {
      await scheduleService.update(code, data);
      toast.success("Cập nhật lịch thành công");
      fetchSchedules(); // Reload data
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
      throw error;
    }
  };

  const deleteSchedule = async (code: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch này?")) return;
    try {
      await scheduleService.delete(code);
      toast.success("Xóa lịch thành công");
      setSchedules((prev) => prev.filter((item) => item.code !== code));
    } catch (error) {
      console.error(error);
      toast.error("Xóa lịch thất bại");
    }
  };

  return {
    schedules,
    isLoading,
    pagination,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
}
