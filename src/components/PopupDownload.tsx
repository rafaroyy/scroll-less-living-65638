import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import appStoreBadge from "@/assets/app-store-badge.png";
import googlePlayBadge from "@/assets/google-play-badge.png";

interface PopupDownloadProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PopupDownload = ({ isOpen, onOpenChange }: PopupDownloadProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[90vw] max-w-lg mx-4 rounded-3xl border-0 shadow-2xl p-6 sm:p-8 fixed left-[30%] top-[20%] transform-none bg-white"
        style={{ backgroundColor: 'white' }}
      >
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold font-poppins mb-4" style={{ color: '#0000FF' }}>
            Download Social Limits
          </DialogTitle>
          <p className="text-lg text-brand-dark/80 font-poppins">
            Choose your platform to start your 3-day free trial
          </p>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 pt-4">
          {/* iOS Download Badge */}
          <button
            onClick={() => {
              window.open('https://apps.apple.com/au/app/social-limits/id6471964510', '_blank');
              onOpenChange(false);
            }}
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-xl"
          >
            <img 
              src={appStoreBadge} 
              alt="Download on the App Store"
              className="h-16 w-auto"
            />
          </button>
          
          {/* OR Separator */}
          <div className="flex items-center space-x-4 w-full">
            <div className="flex-1 h-px bg-brand-dark/20"></div>
            <span className="text-brand-dark/60 font-poppins font-medium text-lg">or</span>
            <div className="flex-1 h-px bg-brand-dark/20"></div>
          </div>
          
          {/* Android Download Badge */}
          <button
            onClick={() => {
              window.open('https://play.google.com/store/apps/details?id=app.sociallimits', '_blank');
              onOpenChange(false);
            }}
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 rounded-xl"
          >
            <img 
              src={googlePlayBadge} 
              alt="Get it on Google Play"
              className="h-16 w-auto"
            />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};