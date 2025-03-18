package test

import (
	"testing"

	helper "github.com/cloudposse/test-helpers/pkg/atmos/component-helper"
)

type ComponentSuite struct {
	helper.TestSuite
}

func TestRunSuite(t *testing.T) {
	suite := new(ComponentSuite)

  // Deploy the dependent vpc component
	suite.AddDependency(t, "vpc", "default-test", nil)

	helper.Run(t, suite)
}
