import React from 'react';

// Type for the Layout Component (Functional or Class Component)
type LayoutComponentProps = {
    children: React.ReactNode;
};

type LayoutComponentType = React.ComponentType<LayoutComponentProps>;

// Type for the Wrapped Component (Functional or Class Component)
type WrappedComponentType = React.ComponentType<any>;

const withLayout = (LayoutComponent: LayoutComponentType) => (
    WrappedComponent: WrappedComponentType
) => {
    const WithLayout: React.FC = (props) => (
        <LayoutComponent>
            <WrappedComponent {...props} />
        </LayoutComponent>
    );

    return WithLayout;
};

export default withLayout;
