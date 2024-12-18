import Icons from '@/assets/icons';

type Props = {
  collapsed: boolean;
};

const Logo = (props: Props) => {
  const { collapsed } = props;

  return (
    <div className="flex h-[4.35rem] items-center px-3">
      <div className="w-8 text-center">
        <img src={Icons.logo} alt="logo" className="h-12" />
      </div>

      {!collapsed && (
        <div>
          <img src={Icons.gkWork} alt="GoKudos Work" className="h-12" />
        </div>
      )}
    </div>
  );
};

export default Logo;
