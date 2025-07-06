type LoadingOverlayProps = {
  show: boolean;
};

export default function LoadingOverlay({ show }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 bg-background/70 backdrop-blur-sm flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}
