package model

import (
	"testing"
)

func TestDB(t *testing.T) {
	_, err := DbInit()
	if err != nil {
		t.Fail()
	}
}
