import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  subTasksCompleted: number;
  subTasksLength: number;
}

export const ProgressBar = ({
  subTasksCompleted,
  subTasksLength,
}: ProgressBarProps) => {
  const percentage = (subTasksCompleted / subTasksLength) * 100;
  return (
    <div>
      <Progress value={percentage} className="mb-1" />
      <div className="flex justify-between">
        <p className="text-xs">
          {subTasksCompleted}/{subTasksLength} subtasks
        </p>
        <p className="text-xs">{percentage}%</p>
      </div>
    </div>
  );
};
